(function () {
  var input = document.getElementById("search");
  var empty = document.getElementById("empty-state");
  var emptyQuery = document.getElementById("empty-query");
  var categories = Array.prototype.slice.call(document.querySelectorAll(".category"));

  function filter() {
    var q = input.value.trim().toLowerCase();
    var anyVisible = false;

    categories.forEach(function (cat) {
      var skills = cat.querySelectorAll(".skill");
      var catHasMatch = false;
      skills.forEach(function (skill) {
        var match = !q || skill.getAttribute("data-search").indexOf(q) !== -1;
        skill.hidden = !match;
        if (match) catHasMatch = true;
      });
      cat.hidden = !catHasMatch;
      if (catHasMatch) anyVisible = true;
    });

    empty.hidden = anyVisible || !q;
    if (!anyVisible && q) emptyQuery.textContent = input.value.trim();
  }

  input.addEventListener("input", filter);
})();
