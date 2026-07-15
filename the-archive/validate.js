// Story-graph validator. Run: node validate.js
// Fails loudly if any choice points at a missing page, any page is
// unreachable, or items/rooms/sprites are referenced but not defined.

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ctx = { window: {}, requestAnimationFrame: () => {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "sprites.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "story.js"), "utf8"), ctx);

// const/let declarations live in the context's shared lexical scope,
// not on the context object — pull them out with an expression.
const { META, ITEMS, ROOMS, PAGES, SPRITES } =
  vm.runInContext("({ META, ITEMS, ROOMS, PAGES, SPRITES })", ctx);
const errors = [];
const pageNums = Object.keys(PAGES).map(Number);

function checkTarget(from, to, what) {
  if (!PAGES[to]) errors.push(`page ${from}: ${what} points to missing page ${to}`);
}

function checkItem(from, id, what) {
  if (!ITEMS[id]) errors.push(`page ${from}: ${what} references unknown item "${id}"`);
}

for (const [num, page] of Object.entries(PAGES)) {
  if (page.room && !ROOMS[page.room]) {
    errors.push(`page ${num}: unknown room "${page.room}"`);
  }
  if (!page.choices && !page.type) {
    errors.push(`page ${num}: has no choices and no terminal type`);
  }
  for (const eff of page.effects || []) {
    if (eff[0] === "add" || eff[0] === "remove") checkItem(num, eff[1], `effect ${eff[0]}`);
    if (eff[0] === "stat" && !(eff[1] in META.stats)) {
      errors.push(`page ${num}: effect targets unknown stat "${eff[1]}"`);
    }
  }
  for (const ch of page.choices || []) {
    if (ch.luck) {
      checkTarget(num, ch.luck.pass, "luck pass");
      checkTarget(num, ch.luck.fail, "luck fail");
    } else {
      checkTarget(num, ch.to, `choice "${ch.label}"`);
    }
    if (ch.needItem) checkItem(num, ch.needItem, "needItem");
    for (const it of ch.needAnyItem || []) checkItem(num, it, "needAnyItem");
    for (const eff of ch.effects || []) {
      if (eff[0] === "add" || eff[0] === "remove") checkItem(num, eff[1], `choice effect`);
    }
  }
}

// death pages must exist and be terminal
for (const [stat, num] of Object.entries(META.deathPages)) {
  if (!PAGES[num]) errors.push(`deathPages.${stat} points to missing page ${num}`);
  else if (PAGES[num].type !== "death") errors.push(`deathPages.${stat} (page ${num}) is not type "death"`);
}

// every item needs a sprite
for (const id of Object.keys(ITEMS)) {
  if (!SPRITES[id]) errors.push(`item "${id}" has no sprite in sprites.js`);
}

// reachability from startPage (death pages are reachable via stat loss)
const reachable = new Set(Object.values(META.deathPages));
const queue = [META.startPage];
while (queue.length) {
  const num = queue.pop();
  if (reachable.has(num) || !PAGES[num]) continue;
  reachable.add(num);
  for (const ch of PAGES[num].choices || []) {
    if (ch.luck) queue.push(ch.luck.pass, ch.luck.fail);
    else queue.push(ch.to);
  }
}
for (const num of pageNums) {
  if (!reachable.has(num)) errors.push(`page ${num} is unreachable from page ${META.startPage}`);
}

if (errors.length) {
  console.error(`FAIL — ${errors.length} problem(s):`);
  errors.forEach(e => console.error("  • " + e));
  process.exit(1);
}
console.log(`OK — ${pageNums.length} pages, all targets valid, all pages reachable.`);
