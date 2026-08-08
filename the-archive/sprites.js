// DEAD SIGNAL — pixel sprite data + canvas renderers.
// Sprites are arrays of strings; each char is a palette key, "." = transparent.
// Rows may be ragged; the renderer treats missing chars as transparent.

const PALETTE = {
  k: "#10141f", // outline / black
  w: "#f4f4f4", // white
  r: "#e23b3b", // red
  o: "#ff8a2a", // orange
  y: "#ffd23e", // yellow
  g: "#46c46a", // green
  b: "#3e6fe2", // blue
  t: "#35d0c4", // teal
  s: "#b8c0cc", // silver
  d: "#5a6272", // dark grey
  m: "#a06a3a", // brown
  p: "#dcd7ff", // pale spore
  f: "#e8a06a", // skin
  h: "#3a2a1e", // hair
  v: "#7de07d", // phosphor green
  x: "#a86bdc", // xeno violet
  n: "#4fe8d0", // bioluminescent cyan
  e: "#d4a15c", // sandstone tan
  j: "#1a5c3a", // deep jungle green
  c: "#8a8a82", // ash grey
};

const SPRITES = {
  multitool: [
    "..........ss",
    ".........ss.",
    "........ss..",
    ".......ss...",
    "......ss....",
    ".....kk.....",
    "....krrk....",
    "...krrrrk...",
    "..krrrrk....",
    "..krrrk.....",
    "...kkk......",
    "............",
  ],
  medkit: [
    "............",
    ".kkkkkkkkkk.",
    ".kwwwwwwwwk.",
    ".kwwwrrwwwk.",
    ".kwwwrrwwwk.",
    ".kwrrrrrrwk.",
    ".kwrrrrrrwk.",
    ".kwwwrrwwwk.",
    ".kwwwrrwwwk.",
    ".kwwwwwwwwk.",
    ".kkkkkkkkkk.",
    "............",
  ],
  stim: [
    "............",
    "..k.........",
    "..kk........",
    "..kkkkkkkk..",
    "..ksssssstk.",
    "..kssssssttk",
    "..ksssssstk.",
    "..kkkkkkkk..",
    "..kk........",
    "..k.........",
    "............",
    "............",
  ],
  rations: [
    "............",
    "...kkkkkk...",
    "..kmmmmmmk..",
    "..kmyyyymk..",
    "..kmyyyymk..",
    "..kmmmmmmk..",
    "..kmwwwwmk..",
    "..kmwwwwmk..",
    "..kmmmmmmk..",
    "...kkkkkk...",
    "............",
    "............",
  ],
  keycard: [
    "............",
    "............",
    ".kkkkkkkkkk.",
    ".kttttttttk.",
    ".ktwwtttttk.",
    ".ktwwtttttk.",
    ".kttttttttk.",
    ".ktddddddtk.",
    ".kttttttttk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
  ],
  torch: [
    ".....oo.....",
    "....oyyo....",
    "....oyyo....",
    ".....oo.....",
    "....kssk....",
    "....kssk....",
    "....kssk....",
    "...kddddk...",
    "...kddddk...",
    "...kddddk...",
    "....kkkk....",
    "............",
  ],
  flare: [
    ".....yy.....",
    "....yooy....",
    "....yooy....",
    ".....rr.....",
    ".....rr.....",
    ".....rr.....",
    ".....rr.....",
    ".....ww.....",
    ".....rr.....",
    ".....rr.....",
    ".....kk.....",
    "............",
  ],
  flashlight: [
    "............",
    "..kkk.......",
    ".kyyyk......",
    ".kyyykkkkkk.",
    ".kyyydssssk.",
    ".kyyydssssk.",
    ".kyyykkkkkk.",
    ".kyyyk......",
    "..kkk.......",
    "............",
    "............",
    "............",
  ],
  sample: [
    "....kkkk....",
    "....kmmk....",
    "....kmmk....",
    "...k....k...",
    "...k....k...",
    "...k.pp.k...",
    "...k.pp.k...",
    "...kppppk...",
    "...kppppk...",
    "....kkkk....",
    "............",
    "............",
  ],
  toolbelt: [
    "............",
    "............",
    "..kkkkkkkk..",
    ".kmmmmmmmmk.",
    ".kmmkyykmmk.",
    ".kmmkyykmmk.",
    ".kmmmmmmmmk.",
    ".kdmmkkmmdk.",
    ".kdmmkkmmdk.",
    "..kkkkkkkk..",
    "............",
    "............",
  ],
  charm: [
    ".....ss.....",
    "....s..s....",
    "....s..s....",
    ".....ss.....",
    "....ksssk...",
    "...ksssssk..",
    "...kssyssk..",
    "...ksyyysk..",
    "...kssyssk..",
    "...ksssssk..",
    "....ksssk...",
    "............",
  ],
  candle: [
    "............",
    "....kkkk....",
    "...koooo k..",
    "...kooook...",
    "...kwwwwk...",
    "...kooook...",
    "...kooook...",
    "...kooook...",
    "...kooook...",
    "....kkkk....",
    "............",
    "............",
  ],
  evahelmet: [
    "....kkkkkk..",
    "...kssssssk.",
    "..kssttttssk",
    "..ksttttttsk",
    "..kstttwttsk",
    "..ksttttttsk",
    "..kssttttssk",
    "...kssssssk.",
    "....kddddk..",
    "............",
    "............",
    "............",
  ],
  evasuit: [
    "....kkkk....",
    "...kwwwwk...",
    "...kwoowk...",
    "..kwwoowwk..",
    "..kwwoowwk..",
    "..kwwwwwwk..",
    "..kwdd..ddk.",
    "..kwd....dk.",
    "...kd....dk.",
    "............",
    "............",
    "............",
  ],
  gloves: [
    "............",
    "...k....k...",
    "..kfk..kfk..",
    "..kfk..kfk..",
    ".kffffkffffk",
    ".kffffkffffk",
    ".kfffffffffk",
    "..kfffffffk.",
    "...kkkkkkk..",
    "............",
    "............",
    "............",
  ],
  magboots: [
    "............",
    "...kk..kk...",
    "..ksk..ksk..",
    "..ksk..ksk..",
    "..ksk..ksk..",
    ".kdddkkdddk.",
    ".kdddkkdddk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  o2tank: [
    "....kkkk....",
    "...kssssk...",
    "...ksssgk...",
    "...ksssgk...",
    "...ksssgk...",
    "...ksssgk...",
    "...ksssgk...",
    "...kssssk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  navkey: [
    "............",
    ".....kk.....",
    "....kyyk....",
    "....kyyk....",
    ".....kk.....",
    ".....kk.....",
    "....kkkk....",
    "...kddddk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  parts: [
    "............",
    "..kkkk.kkkk.",
    ".kssssksssk.",
    ".kstttkstsk.",
    ".ksssskssssk",
    ".kkkk...kkk.",
    "..kddk.kddk.",
    "............",
    "............",
    "............",
    "............",
    "............",
  ],
  sedative: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkkkkk...",
    "...kbbbbk...",
    "...kbbbbk...",
    "...kbwbbk...",
    "...kbbbbk...",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],

  // --- The Last Warden items ---
  shortsword: [
    "......kk....",
    ".....kssk...",
    ".....kssk...",
    ".....kssk...",
    ".....kssk...",
    ".....kssk...",
    "....kkkkkk..",
    ".....kmmk...",
    ".....kmmk...",
    "....kddddk..",
    "............",
    "............",
  ],
  silverblade: [
    "......kk....",
    ".....kwwk...",
    "....kwwwwk..",
    ".....kwwk...",
    ".....kwwk...",
    ".....kwwk...",
    "....kkkkkk..",
    ".....kyyk...",
    ".....kyyk...",
    "....kddddk..",
    "............",
    "............",
  ],
  woodtorch: [
    "....k..kk...",
    "...ko.okk...",
    "..koooook...",
    "..kyyyyyk...",
    "...kyyyk....",
    "....kkk.....",
    "....kmmk....",
    "....kmmk....",
    "....kmmk....",
    "....kmmk....",
    ".....kk.....",
    "............",
  ],
  chainmail: [
    "...kkkkkk...",
    "..ksssssssk.",
    "..kssssssk..",
    ".kssssssssk.",
    ".kssssssssk.",
    ".kssssssssk.",
    ".kssssssssk.",
    "..ksssssssk.",
    "..kssssssk..",
    "...kssssk...",
    "............",
    "............",
  ],
  greathelm: [
    "...kkkkkk...",
    "..kddddddk..",
    ".kddwwwwddk.",
    ".kdd.kk.ddk.",
    ".kddwwwwddk.",
    ".kddd..dddk.",
    ".kdddkkdddk.",
    "..kddkkddk..",
    "...kdkkdk...",
    "....kkkk....",
    "............",
    "............",
  ],
  gauntlets: [
    "............",
    "..kkk..kkk..",
    ".ksssk.ksssk",
    ".ksssk.ksssk",
    ".ksssksksssk",
    ".ksssssssssk",
    ".ksssssssssk",
    "..ksssssssk.",
    "...kkkkkkk..",
    "............",
    "............",
    "............",
  ],
  warboots: [
    "............",
    "...kk..kk...",
    "..kmmk.kmmk.",
    "..kmmk.kmmk.",
    "..kmmk.kmmk.",
    ".kdddkkdddk.",
    ".kdddkkdddk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  wardencloak: [
    "....kkkk....",
    "...kbbbbk...",
    "..kbbbbbbk..",
    "..kbbbbbbk..",
    ".kbbbbbbbbk.",
    ".kbbbbbbbbk.",
    ".kbbbbbbbbk.",
    ".kbb....bbk.",
    ".kb......bk.",
    "kb........bk",
    "............",
    "............",
  ],
  bread: [
    "............",
    "...kkkkkk...",
    "..kmmmmmmk..",
    ".kmyyyyyymk.",
    ".kmyyyyyymk.",
    ".kmyyyyyymk.",
    ".kmmmmmmmmk.",
    "..kmmmmmmk..",
    "............",
    "............",
    "............",
    "............",
  ],
  draught: [
    "............",
    "....kkkk....",
    "....kwwk....",
    "...kkwwkk...",
    "...krrrrk...",
    "..krrrrrrk..",
    "..krrrrrrk..",
    "..krrrrrrk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  holywater: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkttkk...",
    "...ktttttk..",
    "..kttttttk..",
    "..ktttttttk.",
    "..kttttttk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  relic: [
    ".....kk.....",
    "....kyyk....",
    "...kyyyyk...",
    "..kyyyyyyk..",
    ".kyyyyyyyyk.",
    "..kyyyyyyk..",
    "...kyyyyk...",
    "....kyyk....",
    ".....kk.....",
    "............",
    "............",
    "............",
  ],
  ironkey: [
    "............",
    "....kkk.....",
    "...kdddk....",
    "...kdddk....",
    "....kkk.....",
    "....kdk.....",
    "....kdk.....",
    "...kdddk....",
    "...kd.dk....",
    "...kd.dk....",
    "............",
    "............",
  ],
  wardenseal: [
    "....kkkk....",
    "...kyyyyk...",
    "..kyywwyyk..",
    "..kywwwwyk..",
    "..kywwwwyk..",
    "..kyywwyyk..",
    "...kyyyyk...",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
  bandage: [
    "............",
    "..kkkkkkkk..",
    ".kwwwwwwwwk.",
    ".kwwwwwwwwk.",
    ".kwwrrrrwwk.",
    ".kwwrrrrwwk.",
    ".kwwwwwwwwk.",
    "..kkkkkkkk..",
    "............",
    "............",
    "............",
    "............",
  ],
  shield: [
    "...kkkkkk...",
    "..kddddddk..",
    ".kdyyyyyydk.",
    ".kdyy..yydk.",
    ".kdy.kk.ydk.",
    ".kdyy..yydk.",
    ".kdyyyyyydk.",
    "..kdddddk...",
    "...kdddk....",
    "....kdk.....",
    "............",
    "............",
  ],
  warhorn: [
    "............",
    "........kk..",
    ".......kyyk.",
    "......kyyyk.",
    "....kkyyk...",
    "...kyyyk....",
    "..kyyyk.....",
    ".kyyyk......",
    "kdyk........",
    "kdk.........",
    "............",
    "............",
  ],
  kingsbane: [
    ".......kk...",
    "......kwwk..",
    ".....kwwwwk.",
    "......kwwk..",
    "......kwwk..",
    "......kwwk..",
    "......kwwk..",
    "....kkkkkkk.",
    ".....kyyk...",
    "....kdddddk.",
    ".....kdk....",
    "............",
  ],
  phoenixdraught: [
    "............",
    "....kkkk....",
    "....kwwk....",
    "...kkwwkk...",
    "...koooook..",
    "..koyyyyook.",
    "..koyyyyook.",
    "..koooooook.",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  boneward: [
    "............",
    "....kwwk....",
    "...kwwwwk...",
    "....kwwk....",
    ".....kk.....",
    "....kwwk....",
    "...kw..wk...",
    "....kwwk....",
    ".....kk.....",
    "............",
    "............",
    "............",
  ],

  // --- First Contact Protocol items ---
  scanner: [
    ".......kk...",
    "......kyyk..",
    ".......kk...",
    "....kkkkkkk.",
    "...kssssssk.",
    "...ksnnnnsk.",
    "...ksnnnnsk.",
    "...kssssssk.",
    "....kkkkkkk.",
    "......kk....",
    ".............",
  ],
  headlamp: [
    "............",
    "....kkkk....",
    "...knnnnk...",
    "..knnnnnnk..",
    "..knnnnnnk..",
    "...knnnnk...",
    "....kddk....",
    "...kddddk...",
    "............",
    "............",
    "............",
    "............",
  ],
  cutter: [
    "..........nn",
    ".........nyy",
    "........nyy.",
    ".......nyy..",
    "......kk....",
    ".....kssk...",
    "....kssssk..",
    "...kddddddk.",
    "....kkkkkk..",
    "............",
    "............",
    "............",
  ],
  traumakit: [
    "............",
    ".kkkkkkkkkk.",
    ".kwwwwwwwwk.",
    ".kwwwnnwwwk.",
    ".kwwwnnwwwk.",
    ".kwnnnnnnwk.",
    ".kwnnnnnnwk.",
    ".kwwwnnwwwk.",
    ".kwwwnnwwwk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
  ],
  sealant: [
    "............",
    "...kkkkkk...",
    "..ksssssssk.",
    "..ksnnnnnsk.",
    "..ksnnnnnsk.",
    "..ksssssssk.",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
    "............",
  ],
  stabilizer: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkkkkk...",
    "...kxxxxk...",
    "...kxnxnk...",
    "...kxxxxk...",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
  ],
  evagloves: [
    "............",
    "...k....k...",
    "..kfk..kfk..",
    "..kfk..kfk..",
    ".kffffkffffk",
    ".kffffkffffk",
    ".kfffffffffk",
    "..kffnffnfk.",
    "...kkkkkkk..",
    "............",
    "............",
    "............",
  ],
  evaboots: [
    "............",
    "...kk..kk...",
    "..ksk..ksk..",
    "..ksk..ksk..",
    "..ksk..ksk..",
    ".kdddkkdddk.",
    ".kdnnkkdnnk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  o2pack: [
    "....kkkk....",
    "...ksssssk..",
    "...ksnnnsk..",
    "...ksnnnsk..",
    "...ksnnnsk..",
    "...ksssssk..",
    "....kkkk....",
    "....k..k....",
    "....k..k....",
    "............",
    "............",
    "............",
  ],
  override: [
    "............",
    "............",
    ".kkkkkkkkkk.",
    ".kxxxxxxxxk.",
    ".kxwwxxxxxk.",
    ".kxwwxxxxxk.",
    ".kxxxxxxxxk.",
    ".kxddddddxk.",
    ".kxxxxxxxxk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
  ],
  shard: [
    ".....kk.....",
    "....kxxk....",
    "...kxxxxk...",
    "..kxxnnxxk..",
    ".kxxnnnnxxk.",
    "..kxxnnxxk..",
    "...kxxxxk...",
    "....kxxk....",
    ".....kk.....",
    "............",
    "............",
    "............",
  ],
  blackbox: [
    "............",
    "..kkkkkkkk..",
    ".korrrrrrok.",
    ".korrrrrrok.",
    ".korrrrrrok.",
    ".kooooooook.",
    "..kkkkkkkk..",
    "....k..k....",
    "............",
    "............",
    "............",
    "............",
  ],
  xenosample: [
    "....kkkk....",
    "....kssk....",
    "....kssk....",
    "...k....k...",
    "...k....k...",
    "...k.nn.k...",
    "...k.xx.k...",
    "...knnxxk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  translator: [
    "............",
    "..kkkkkkkk..",
    ".ksnnnnnnsk.",
    ".ksnkkkknsk.",
    ".ksnkxxknsk.",
    ".ksnkkkknsk.",
    ".ksnnnnnnsk.",
    "..kkkkkkkk..",
    "....kssk....",
    "............",
    "............",
    "............",
  ],
  gift: [
    "............",
    ".....kk.....",
    "....kxxk....",
    "...kxxxxk...",
    "..kxxnnxxk..",
    ".kxnnnnnnxk.",
    "..kxxnnxxk..",
    "...kxxxxk...",
    "....kxxk....",
    ".....kk.....",
    "............",
    "............",
  ],
  resonantcore: [
    "............",
    "....kxxk....",
    "...kxnnxk...",
    "..kxnnnnxk..",
    ".kxnnnnnnxk.",
    ".kxnnnnnnxk.",
    "..kxnnnnxk..",
    "...kxnnxk...",
    "....kxxk....",
    "............",
    "............",
    "............",
  ],
  codexfragment: [
    "............",
    "..kkkkkkkk..",
    ".knnnnnnnnk.",
    ".knxxxxxxnk.",
    ".knxnnnnxnk.",
    ".knxnxxnxnk.",
    ".knxnnnnxnk.",
    ".knxxxxxxnk.",
    ".knnnnnnnnk.",
    "..kkkkkkkk..",
    "............",
    "............",
  ],
  relaykey: [
    "............",
    "....kkkk....",
    "...kxxxxk...",
    "...kxnnxk...",
    "....kxxk.....",
    ".....kk......",
    ".....kk......",
    "....kkkk.....",
    "...kd..dk....",
    "...kd..dk....",
    "............",
    "............",
  ],

  // --- Tomb of the Unbroken Seal items ---
  lamp: [
    "............",
    "....kk......",
    "...koyk.....",
    "..keeeek....",
    ".keeeeeek...",
    ".keeeeeek...",
    "..keeeek....",
    "...kkkk.....",
    "....kk......",
    "............",
    "............",
    "............",
  ],
  chisel: [
    "..........kk",
    ".........kek",
    "........kek.",
    ".......kek..",
    "......kek...",
    ".....kek....",
    "....kek.....",
    "...kmmk.....",
    "..kmmk......",
    "............",
    "............",
    "............",
  ],
  blade: [
    ".......kk...",
    "......kyyk..",
    ".....kyyk...",
    "....kyyk....",
    "...kyyk.....",
    "..kyyk......",
    ".kkkk.......",
    "kmmk........",
    "kmmk........",
    "............",
    "............",
    "............",
  ],
  tonic: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkkkkk...",
    "...kggggk...",
    "...kggggk...",
    "...kggggk...",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
  ],
  waterskin: [
    "............",
    "....kkk.....",
    "...kmemk....",
    "..kmeeemk...",
    ".kmeeeeemk..",
    ".kmeeeeemk..",
    ".kmeeeeemk..",
    "..kmeeemk...",
    "...kmmmk....",
    "............",
    "............",
    "............",
  ],
  linenwrap: [
    "............",
    "..kkkkkkkk..",
    ".kwwwwwwwwk.",
    ".kwewewewwk.",
    ".kwewewewwk.",
    ".kwwwwwwwwk.",
    "..kkkkkkkk..",
    "............",
    "............",
    "............",
    "............",
    "............",
  ],
  calmherb: [
    "............",
    "....k.k.....",
    "...kgkgk....",
    "..kgggggk...",
    "...kgkgk....",
    "....k.k.....",
    ".....k......",
    ".....k......",
    "............",
    "............",
    "............",
    "............",
  ],
  scarab: [
    "............",
    "....kkkk....",
    "...kyyyyk...",
    "..kytytytk..",
    ".kyyyyyyyk..",
    ".kytytytk...",
    "..kyyyyk....",
    "...k..k.....",
    "..k....k....",
    "............",
    "............",
    "............",
  ],
  priestmask: [
    "....kkkk....",
    "...kbbbbk...",
    "..kbbbbbbk..",
    "..kbeeebbk..",
    "..kbebebbk..",
    "..kbeeebbk..",
    "..kbbkkbbk..",
    "...kbggbk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  ceremonialrobe: [
    "....kkkk....",
    "...keeeek...",
    "..keeeeeek..",
    ".keeybyeeek.",
    ".keeeeeeeek.",
    ".keeeeeeeek.",
    "..keeeeeek..",
    "...ke..ek...",
    "...ke..ek...",
    "............",
    "............",
    "............",
  ],
  ritualgloves: [
    "............",
    "...k....k...",
    "..kek..kek..",
    "..kek..kek..",
    ".keeek.keeek",
    ".keeekkkeeek",
    ".keeeeeeeek.",
    "..keeeeeek..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  sacredsandals: [
    "............",
    "...kk..kk...",
    "..kek..kek..",
    "..kek..kek..",
    "..kek..kek..",
    ".keeekkeeek.",
    ".keeekkeeek.",
    "keeeekkeeeek",
    "keeeekkeeeek",
    "............",
    "............",
    "............",
  ],
  amuletcord: [
    "....kkkk....",
    "...k....k...",
    "..k......k..",
    "..k......k..",
    "...k....k...",
    "....kyyk....",
    "...kytytk...",
    "....kyyk.....",
    ".....kk......",
    "............",
    "............",
    "............",
  ],
  sealring: [
    "............",
    "...kkkkkk...",
    "..kyyyyyyk..",
    ".kyybkbyyk..",
    ".kyybkbyyk..",
    ".kyyyyyyyk..",
    "..kyyyyyk...",
    "...kkkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
  papyrus: [
    "............",
    ".kkkkkkkkkk.",
    ".keeeeeeeek.",
    ".keytytytek.",
    ".keeeeeeeek.",
    ".keytytytek.",
    ".keeeeeeeek.",
    ".kkkkkkkkkk.",
    "............",
    "............",
    "............",
    "............",
  ],
  canopicjar: [
    "............",
    "....kkkk....",
    "...keeeek...",
    "...kfeeek...",
    "...keeeek...",
    "..kyeeeeyk..",
    "..kyeeeeyk..",
    "..kyeeeeyk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  heartweight: [
    "............",
    "...kk..kk...",
    "..krrk.kwwk.",
    ".krrrrkkwwwk",
    ".krrrrkkwwwk",
    "..krrrkwwwk.",
    "...krkkwwk..",
    "....kk.kk...",
    "............",
    "............",
    "............",
    "............",
  ],
  ankh: [
    "....kkk.....",
    "...kyyyk....",
    "...ky.yk....",
    "....kyk.....",
    "..kkkykkk...",
    ".kyyyyyyyk..",
    "....kyk.....",
    "....kyk.....",
    "....kyk.....",
    "....kkk.....",
    "............",
    "............",
  ],
  trueseal: [
    "............",
    "...kkkkkk...",
    "..kyyyyyyk..",
    ".kyybbbbyyk.",
    ".kybebebeyk.",
    ".kybebebeyk.",
    ".kyybbbbyyk.",
    "..kyyyyyyk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  duatwater: [
    "............",
    "....kkk.....",
    "...kbbbk....",
    "..kbbbbbk...",
    ".kbbbbbbbk..",
    ".kbbbbbbbk..",
    ".kbbbbbbbk..",
    "..kbbbbbk...",
    "...kkkkk....",
    "............",
    "............",
    "............",
  ],
  predecessorscroll: [
    "............",
    ".kk......kk.",
    ".ke........k",
    ".keeeeeeeek.",
    ".keytytyek..",
    ".keeeeeeeek.",
    ".keytytyek..",
    ".keeeeeeeek.",
    ".kk......kk.",
    "............",
    "............",
    "............",
  ],
  isfetshard: [
    "............",
    ".....kk.....",
    "....kddk....",
    "...kdkkdk...",
    "..kdk..kdk..",
    ".kdk....kdk.",
    "..kdk..kdk..",
    "...kdkkdk...",
    "....kddk....",
    "............",
    "............",
    "............",
  ],
  accordtoken: [
    "............",
    "....kkkk....",
    "...ktbbtk...",
    "..ktbbbbtk..",
    ".ktbbyybbtk.",
    ".ktbbyybbtk.",
    "..ktbbbbtk..",
    "...ktbbtk...",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],

  // --- Green Silence items ---
  machete: [
    ".........kk.",
    "........kssk",
    ".......kssk.",
    "......kssk..",
    ".....kssk...",
    "....kssk....",
    "...kmmk.....",
    "..kmmk......",
    "..kmk.......",
    "............",
    "............",
    "............",
  ],
  fieldlamp: [
    "............",
    "....kkkk....",
    "...kyyyyk...",
    "..kyywwyyk..",
    "..kyywwyyk..",
    "...kyyyyk...",
    "....kddk....",
    "...kddddk...",
    "............",
    "............",
    "............",
    "............",
  ],
  resintorch: [
    "......ook...",
    ".....oyyko..",
    "....koyyok..",
    ".....kook...",
    "......kk....",
    "......mm....",
    "......mm....",
    "......mm....",
    ".....kmmk...",
    "............",
    "............",
    "............",
  ],
  dressingkit: [
    "............",
    ".kkkkkkkkkk.",
    ".kwwwwwwwwk.",
    ".kwwwggwwwk.",
    ".kwwwggwwwk.",
    ".kwggggggwk.",
    ".kwggggggwk.",
    ".kwwwggwwwk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
    "............",
  ],
  quininetonic: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkkkkk...",
    "...kvvvvk...",
    "...kvvvvk...",
    "...kvvvvk...",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
  ],
  driedrations: [
    "............",
    "...kkkkkk...",
    "..kmmmmmmk..",
    "..kmyyyymk..",
    "..kmyyyymk..",
    "..kmmmmmmk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
    "............",
  ],
  calmingleaf: [
    "............",
    "......kk....",
    ".....kggk...",
    "....kggggk..",
    "...kggjggk..",
    "....kggggk..",
    ".....kggk...",
    "......kk.....",
    ".......k......",
    "............",
    "............",
    "............",
  ],
  riverstone: [
    "............",
    "....kkkk....",
    "...ktttttk..",
    "..ktttttttk.",
    "..ktttbtttk.",
    "..ktttttttk.",
    "...ktttttk..",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
  junglehat: [
    "...kkkkkkk..",
    "..kmmmmmmmk.",
    ".kmmmmmmmmmk",
    "..kkkkkkkkk.",
    "....kmmmk...",
    "...kmmmmmk..",
    "...kmmmmmk..",
    "....kmmmk...",
    "............",
    "............",
    "............",
    "............",
  ],
  oilcloak: [
    "....kkkk....",
    "...kjjjjk...",
    "..kjjjjjjk..",
    ".kjjjjjjjjk.",
    ".kjjjjjjjjk.",
    ".kjjjjjjjjk.",
    "..kjjjjjjk..",
    "...kj..jk...",
    "...kj..jk...",
    "............",
    "............",
    "............",
  ],
  trackergloves: [
    "............",
    "...k....k...",
    "..kmk..kmk..",
    "..kmk..kmk..",
    ".kmmmk.kmmmk",
    ".kmmmkkmmmk.",
    ".kmmmmmmmmk.",
    "..kmmmmmmk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  muddedboots: [
    "............",
    "...kk..kk...",
    "..kmk..kmk..",
    "..kmk..kmk..",
    "..kmk..kmk..",
    ".kdddkkdddk.",
    ".kdddkkdddk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  waterpack: [
    "....kkkk....",
    "...ktttttk..",
    "...ktjjjtk..",
    "...ktjjjtk..",
    "...ktjjjtk..",
    "...ktttttk..",
    "....kkkk....",
    "....k..k....",
    "....k..k....",
    "............",
    "............",
    "............",
  ],
  brokencompass: [
    "............",
    "....kkkk....",
    "...ksssssk..",
    "..kswwwwwsk.",
    "..ksw.k.wsk.",
    "..ksw..kwsk.",
    "..kswwwwwsk.",
    "...ksssssk..",
    "....kkkk....",
    "............",
    "............",
    "............",
  ],
  expeditionjournal: [
    "............",
    ".kkkkkkkkkk.",
    ".kmmmmmmmmk.",
    ".kmwwwwwwmk.",
    ".kmwtytywmk.",
    ".kmwwwwwwmk.",
    ".kmwtytywmk.",
    ".kmmmmmmmmk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
    "............",
  ],
  memoryseed: [
    "............",
    ".....kk.....",
    "....kvvk....",
    "...kvvvvk...",
    "...kvjvjvk..",
    "...kvvvvk...",
    "....kvvk....",
    ".....kk.....",
    "............",
    "............",
    "............",
    "............",
  ],
  rootkey: [
    "............",
    "....kk......",
    "...kmmk.....",
    "..kmjmk.....",
    ".kmjjmk.....",
    "..kmjmkk....",
    "...kmk.kk...",
    "....k.kmk...",
    "......kmk...",
    "............",
    "............",
    "............",
  ],
  silverleaf: [
    "......kk.....",
    ".....kssk....",
    "....kssssk...",
    "...ksssjssk..",
    "..kssssjssk..",
    "...ksssjssk..",
    "....kssssk...",
    ".....kssk....",
    "......kk.....",
    "............",
    "............",
    "............",
  ],
  surveystake: [
    "......kk....",
    ".....kyok...",
    "....koyok...",
    ".....kok.....",
    ".....kok.....",
    ".....kok.....",
    ".....kok.....",
    "....kddk....",
    "...kddddk...",
    "............",
    "............",
    "............",
  ],
  heartwoodsap: [
    "............",
    "....kkkk....",
    "...kmmmmk...",
    "..kmoooomk..",
    "..kmoooomk..",
    "..kmoooomk..",
    "...kmmmmk...",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
  kinshiptoken: [
    "............",
    "....kkkk....",
    "...kvgvgk...",
    "..kvgvgvgk..",
    ".kvgvgvgvgk.",
    "..kvgvgvgk..",
    "...kvgvgk...",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],

  // --- Ashfall items ---
  pryrod: [
    "..........kk",
    ".........kdk",
    "........kdk.",
    ".......kdk..",
    "......kdk...",
    ".....kdk....",
    "....kdk.....",
    "...kddk.....",
    "..kdk.......",
    "............",
    "............",
    "............",
  ],
  handlamp: [
    "............",
    "..kkk.......",
    ".kyyyk......",
    ".kyyykkkkkk.",
    ".kyyydccccd.",
    ".kyyydccccd.",
    ".kyyykkkkkk.",
    ".kyyyk......",
    "..kkk.......",
    "............",
    "............",
    "............",
  ],
  shivblade: [
    ".......kk...",
    "......kssk..",
    ".....kssk...",
    "....kssk....",
    "...kssk.....",
    "..kkkk......",
    ".kmmk.......",
    ".kmmk.......",
    "..kk........",
    "............",
    "............",
    "............",
  ],
  medsupply: [
    "............",
    ".kkkkkkkkkk.",
    ".kccccccccm.",
    ".kccrrccccm.",
    ".kccrrccccm.",
    ".kcrrrrccccm",
    ".kccrrccccm.",
    ".kccccccccm.",
    ".kkkkkkkkkk.",
    "............",
    "............",
    "............",
  ],
  stimpack: [
    "............",
    "..k.........",
    "..kk........",
    "..kkkkkkkk..",
    "..kooooootk.",
    "..kooooottk.",
    "..kooooootk.",
    "..kkkkkkkk..",
    "..kk........",
    "............",
    "............",
    "............",
  ],
  waterration: [
    "............",
    "....kkk.....",
    "...ksssk....",
    "..kbbbbbk...",
    ".kbbbbbbbk..",
    ".kbbbbbbbk..",
    ".kbbbbbbbk..",
    "..kbbbbbk...",
    "...kkkkk....",
    "............",
    "............",
    "............",
  ],
  painkillers: [
    "............",
    "...kkkkkk...",
    "..kwwwwwwk..",
    "..kwtttwwk..",
    "..kwtttwwk..",
    "..kwwwwwwk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
    "............",
  ],
  luckycoin: [
    "............",
    "....kkkk....",
    "...kyyyyk...",
    "..kyywyyyk..",
    "..kyywyyyk..",
    "..kyywyyyk..",
    "...kyyyyk...",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
  ashmask: [
    "...kkkkkkk..",
    "..kddddddddk",
    ".kdssssssssdk",
    ".kdsttttssdk.",
    ".kdsttttssdk.",
    ".kdssssssssdk",
    "..kdddkdddk.",
    "...kkk.kkk..",
    "............",
    "............",
    "............",
    "............",
  ],
  duncoat: [
    "....kkkk....",
    "...kccccck..",
    "..kccccccck.",
    ".kccrccrcck.",
    ".kccccccccck",
    ".kccccccccck",
    "..kccccccck.",
    "...kc..cck..",
    "...kc..cck..",
    "............",
    "............",
    "............",
  ],
  scavgloves: [
    "............",
    "...k....k...",
    "..kdk..kdk..",
    "..kdk..kdk..",
    ".kdddk.kdddk",
    ".kdddkkdddk.",
    ".kddddddddk.",
    "..kddddddk..",
    "...kkkkkk...",
    "............",
    "............",
    "............",
  ],
  treadboots: [
    "............",
    "...kk..kk...",
    "..kdk..kdk..",
    "..kdk..kdk..",
    "..kdk..kdk..",
    ".kdddkkdddk.",
    ".kdddkkdddk.",
    "kddddkkddddk",
    "kddddkkddddk",
    "............",
    "............",
    "............",
  ],
  filterpack: [
    "....kkkk....",
    "...kccccck..",
    "...kctttck..",
    "...kctttck..",
    "...kctttck..",
    "...kccccck..",
    "....kkkk....",
    "....k..k....",
    "....k..k....",
    "............",
    "............",
    "............",
  ],
  convoymanifest: [
    "............",
    ".kkkkkkkkkk.",
    ".kccccccccm.",
    ".kcwwwwwwcm.",
    ".kcwdwdwwcm.",
    ".kcwwwwwwcm.",
    ".kcwdwdwwcm.",
    ".kccccccccm.",
    ".kkkkkkkkkk.",
    "............",
    "............",
    "............",
  ],
  hushsample: [
    "............",
    "....kkkk....",
    "....kssk....",
    "...kkkkkk...",
    "...kcccck...",
    "...kcccck...",
    "...kcccck...",
    "...kkkkkk...",
    "............",
    "............",
    "............",
    "............",
  ],
  greyheart: [
    "............",
    ".....kk.....",
    "....kccck...",
    "...kccccck..",
    "..kccctcccm.",
    "...kccccck..",
    "....kccck...",
    ".....kk.....",
    "............",
    "............",
    "............",
    "............",
  ],
  settlementledger: [
    "............",
    ".kkkkkkkkkk.",
    ".kmmmmmmmmk.",
    ".kmwwwwwwmk.",
    ".kmwdydywmk.",
    ".kmwwwwwwmk.",
    ".kmwdydywmk.",
    ".kmmmmmmmmk.",
    ".kkkkkkkkkk.",
    "............",
    "............",
    "............",
  ],
  warmstone: [
    "............",
    "....kkkk....",
    "...koooook..",
    "..koyyyyook.",
    "..koyyyyook.",
    "..koyyyyook.",
    "...koooook..",
    "....kkkk....",
    "............",
    "............",
    "............",
    "............",
  ],
};

function drawSprite(canvas, sprite, scale) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    for (let x = 0; x < row.length; x++) {
      const c = PALETTE[row[x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

// Simple pixel silhouette of a person, with per-slot highlight color
// when that equipment slot is filled. 6x10 grid, scaled up.
const DOLL_BASE = [
  "..kk..",
  ".kffk.",
  ".kffk.",
  ".kook.",
  "kooook",
  "kooook",
  ".ko.ok",
  ".ko.ok",
  ".ko.ok",
  ".kk.kk",
];
function drawPaperDoll(canvas, equipped) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = Math.floor(canvas.width / 6);
  for (let y = 0; y < DOLL_BASE.length; y++) {
    for (let x = 0; x < DOLL_BASE[y].length; x++) {
      const c = PALETTE[DOLL_BASE[y][x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  const glow = (row, on) => {
    if (!on) return;
    ctx.fillStyle = "rgba(125,224,125,0.55)";
    ctx.fillRect(0, row * scale, canvas.width, scale);
  };
  glow(0, equipped.head);
  glow(3, equipped.body);
  glow(6, equipped.hands);
  glow(9, equipped.feet);
  glow(4, equipped.back);
}

// --- Starfield (top-right panel backdrop) ---
function startStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 900);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.85 ? 1 : 2,
        v: 0.03 + Math.random() * 0.12,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);
  function frame(t) {
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const st of stars) {
      st.x -= st.v;
      if (st.x < 0) { st.x = canvas.width; st.y = Math.random() * canvas.height; }
      const a = 0.5 + 0.5 * Math.sin(t / 700 + st.tw);
      ctx.fillStyle = `rgba(220, 230, 255, ${0.35 + 0.55 * a})`;
      ctx.fillRect(Math.round(st.x), Math.round(st.y), st.s, st.s);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Embers (top-right panel backdrop, torchlit dungeon stone) ---
function startEmbers(canvas) {
  const ctx = canvas.getContext("2d");
  let embers = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    embers = [];
    const n = Math.floor((canvas.width * canvas.height) / 1400);
    for (let i = 0; i < n; i++) {
      embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.8 ? 1 : 2,
        vy: 0.05 + Math.random() * 0.14,
        drift: (Math.random() - 0.5) * 0.05,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);
  function frame(t) {
    // dark stone base with a faint warm vignette, as if lit from one corner
    ctx.fillStyle = "#0e0a06";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const glow = ctx.createRadialGradient(
      canvas.width * 0.18, canvas.height * 1.05, 0,
      canvas.width * 0.18, canvas.height * 1.05, canvas.width * 0.9
    );
    const flicker = 0.5 + 0.5 * Math.sin(t / 260) * 0.15 + 0.35;
    glow.addColorStop(0, `rgba(120, 70, 20, ${0.25 + flicker * 0.1})`);
    glow.addColorStop(1, "rgba(14, 10, 6, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const em of embers) {
      em.y -= em.vy;
      em.x += em.drift;
      if (em.y < 0) { em.y = canvas.height; em.x = Math.random() * canvas.width; }
      const a = 0.4 + 0.6 * Math.sin(t / 500 + em.tw);
      ctx.fillStyle = `rgba(255, ${140 + Math.round(60 * a)}, 60, ${0.3 + 0.5 * a})`;
      ctx.fillRect(Math.round(em.x), Math.round(em.y), em.s, em.s);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Parchment map (top-right panel backdrop: an aged, hand-charted map) ---
function startParchmentMap(canvas) {
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function compassRose(cx, cy, r, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = `rgba(217,164,65,${alpha})`;
    ctx.fillStyle = `rgba(217,164,65,${alpha})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i;
      const len = i % 2 === 0 ? r : r * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const stains = [[0.15, 0.2, 0.5], [0.82, 0.15, 0.4], [0.6, 0.85, 0.55], [0.22, 0.78, 0.45]];

  function frame(t) {
    ctx.fillStyle = "#120c07";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const [sx, sy, sr] of stains) {
      const g = ctx.createRadialGradient(
        canvas.width * sx, canvas.height * sy, 0,
        canvas.width * sx, canvas.height * sy, canvas.width * sr
      );
      g.addColorStop(0, "rgba(90,60,25,0.14)");
      g.addColorStop(1, "rgba(90,60,25,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.strokeStyle = "rgba(140,110,60,0.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yBase = canvas.height * (0.22 + i * 0.3);
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= canvas.width; x += 18) {
        ctx.lineTo(x, yBase + Math.sin(x / 45 + i * 1.7) * 7);
      }
      ctx.stroke();
    }

    const glow = 0.3 + 0.15 * Math.sin(t / 900);
    compassRose(canvas.width - 24, canvas.height - 24, 15, glow);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Xenoscan (top-right panel backdrop: a deep-space listening array,
// bioluminescent pulses radiating outward like something answering back) ---
function startXenoscan(canvas) {
  const ctx = canvas.getContext("2d");
  let motes = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    motes = [];
    const n = Math.floor((canvas.width * canvas.height) / 1100);
    for (let i = 0; i < n; i++) {
      motes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.75 ? 1 : 2,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.5 ? "168,224,208" : "168,107,220",
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);

  const cx = () => canvas.width * 0.5;
  const cy = () => canvas.height * 0.46;

  function frame(t) {
    ctx.fillStyle = "#07050c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const vg = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), canvas.width * 0.7);
    vg.addColorStop(0, "rgba(70,30,90,0.20)");
    vg.addColorStop(1, "rgba(7,5,12,0)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // outward-pulsing listening rings, like a radar answering something distant
    const period = 3200;
    for (let i = 0; i < 3; i++) {
      const phase = ((t + i * (period / 3)) % period) / period;
      const r = phase * canvas.width * 0.65;
      const a = (1 - phase) * 0.28;
      if (a <= 0) continue;
      ctx.strokeStyle = `rgba(120,220,200,${a})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx(), cy(), r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const m of motes) {
      m.x += m.vx; m.y += m.vy;
      if (m.x < 0) m.x = canvas.width; if (m.x > canvas.width) m.x = 0;
      if (m.y < 0) m.y = canvas.height; if (m.y > canvas.height) m.y = 0;
      const a = 0.35 + 0.55 * Math.sin(t / 650 + m.tw);
      ctx.fillStyle = `rgba(${m.hue},${0.25 + 0.55 * a})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.s, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Dune Drift (top-right panel backdrop: desert night, drifting sand,
// a slow-pulsing ankh glow — the tomb's threshold, not yet breached) ---
function startDuneDrift(canvas) {
  const ctx = canvas.getContext("2d");
  let grains = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    grains = [];
    const n = Math.floor((canvas.width * canvas.height) / 1300);
    for (let i = 0; i < n; i++) {
      grains.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.8 ? 1 : 2,
        vx: 0.04 + Math.random() * 0.1,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);

  function frame(t) {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#1a1006"); sky.addColorStop(1, "#0d0804");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // dune silhouette horizon
    ctx.fillStyle = "#241708";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.7);
    ctx.quadraticCurveTo(canvas.width * 0.3, canvas.height * 0.58, canvas.width * 0.55, canvas.height * 0.72);
    ctx.quadraticCurveTo(canvas.width * 0.8, canvas.height * 0.62, canvas.width, canvas.height * 0.75);
    ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(0, canvas.height);
    ctx.closePath(); ctx.fill();

    // pulsing ankh glow, low on the horizon
    const cx = canvas.width * 0.5, cy = canvas.height * 0.68;
    const glow = 0.35 + 0.25 * Math.sin(t / 1000);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.22);
    g.addColorStop(0, `rgba(212,161,92,${glow})`); g.addColorStop(1, "rgba(212,161,92,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const gr of grains) {
      gr.x += gr.vx;
      if (gr.x > canvas.width) { gr.x = 0; gr.y = Math.random() * canvas.height; }
      const a = 0.3 + 0.5 * Math.sin(t / 700 + gr.tw);
      ctx.fillStyle = `rgba(212,161,92,${a})`;
      ctx.fillRect(Math.round(gr.x), Math.round(gr.y), gr.s, gr.s);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Canopy Drift (top-right panel backdrop: dense jungle canopy,
// dappled sunlight shafts, drifting fireflies/pollen) ---
function startCanopyDrift(canvas) {
  const ctx = canvas.getContext("2d");
  let motes = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    motes = [];
    const n = Math.floor((canvas.width * canvas.height) / 1500);
    for (let i = 0; i < n; i++) {
      motes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.8 ? 1 : 2,
        vy: -(0.03 + Math.random() * 0.07),
        vx: (Math.random() - 0.5) * 0.04,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);

  const canopyBlobs = [[0.08, 0.15, 0.22], [0.3, 0.1, 0.18], [0.55, 0.18, 0.24], [0.78, 0.08, 0.2], [0.95, 0.2, 0.18]];

  function frame(t) {
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#0a1a10"); bg.addColorStop(1, "#050d08");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // canopy silhouette along the top
    ctx.fillStyle = "#0e2416";
    for (const [bx, by, br] of canopyBlobs) {
      ctx.beginPath();
      ctx.arc(canvas.width * bx, canvas.height * by, canvas.width * br, 0, Math.PI * 2);
      ctx.fill();
    }

    // dappled light shafts, slowly swaying
    for (let i = 0; i < 3; i++) {
      const sway = Math.sin(t / 2600 + i * 2) * canvas.width * 0.06;
      const sx = canvas.width * (0.2 + i * 0.32) + sway;
      const g = ctx.createLinearGradient(sx, 0, sx + canvas.width * 0.12, canvas.height);
      g.addColorStop(0, "rgba(232,196,104,0.10)");
      g.addColorStop(1, "rgba(232,196,104,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx + canvas.width * 0.12, 0);
      ctx.lineTo(sx + canvas.width * 0.22, canvas.height);
      ctx.lineTo(sx - canvas.width * 0.02, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    for (const m of motes) {
      m.y += m.vy; m.x += m.vx;
      if (m.y < 0) { m.y = canvas.height; m.x = Math.random() * canvas.width; }
      const a = 0.35 + 0.55 * Math.sin(t / 650 + m.tw);
      ctx.fillStyle = `rgba(140,224,100,${0.25 + 0.55 * a})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.s, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Ashfall (top-right panel backdrop: a ruined skyline under endless
// grey ash, one distant ember glow that never quite goes out) ---
function startAshfallDrift(canvas) {
  const ctx = canvas.getContext("2d");
  let flakes = [];
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    flakes = [];
    const n = Math.floor((canvas.width * canvas.height) / 900);
    for (let i = 0; i < n; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() < 0.75 ? 1 : 2,
        vy: 0.06 + Math.random() * 0.1,
        vx: (Math.random() - 0.5) * 0.03,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);

  const skyline = [[0, 0.6, 0.1], [0.09, 0.48, 0.09], [0.2, 0.65, 0.13], [0.35, 0.52, 0.08],
                   [0.45, 0.68, 0.15], [0.62, 0.55, 0.1], [0.74, 0.62, 0.12], [0.88, 0.5, 0.09]];

  function frame(t) {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#151412"); sky.addColorStop(1, "#0a0908");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // one distant ember, low and slow
    const emberX = canvas.width * 0.72, emberY = canvas.height * 0.6;
    const glow = 0.4 + 0.2 * Math.sin(t / 1400);
    const g = ctx.createRadialGradient(emberX, emberY, 0, emberX, emberY, canvas.width * 0.22);
    g.addColorStop(0, `rgba(226,130,60,${0.30 * glow})`);
    g.addColorStop(1, "rgba(226,130,60,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ruined skyline silhouette
    ctx.fillStyle = "#141210";
    for (const [bx, by, bw] of skyline) {
      ctx.fillRect(canvas.width * bx, canvas.height * by, canvas.width * bw, canvas.height);
    }

    for (const fl of flakes) {
      fl.y += fl.vy; fl.x += fl.vx;
      if (fl.y > canvas.height) { fl.y = 0; fl.x = Math.random() * canvas.width; }
      const a = 0.3 + 0.4 * Math.sin(t / 800 + fl.tw);
      ctx.fillStyle = `rgba(160,158,150,${0.3 + 0.4 * a})`;
      ctx.fillRect(Math.round(fl.x), Math.round(fl.y), fl.s, fl.s);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
