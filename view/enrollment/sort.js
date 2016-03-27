var tools = require("./tools.js");
var viewEvents = appRequire("view/events.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var nameClass = "." + tools.nameClass;
var valueClass = "." + tools.valueClass;

var outcomesSortClass = ".outcomes-sort";
var incomesSortClass = ".incomes-sort";
var checkedClass = "checked";

var alphabetSortClass = "alphabetically";
var valueSortClass = "values";
var lowestFirstClass = "lowest-first";
var highestFirstClass = "highest-first";

$(document).on(viewEvents.enrollmentsDrawed , function() {
  $(outcomesSortClass).click(function() {
    $(outcomesSortClass).removeClass(checkedClass);
    applySort($(this), outcomesId);
  });

  $(incomesSortClass).click(function() {
    $(incomesSortClass).removeClass(checkedClass);
    applySort($(this), incomesId);
  });

  /* Default sorting */
  $(outcomesSortClass + "." + valueSortClass + "." + highestFirstClass).click();
  $(incomesSortClass + "." + valueSortClass + "." + highestFirstClass).click();
});

function applySort(e, listId) {
  var items = $(listId).children("li").get();
  var comparator = chooseComparator(e);
  items = sortItems(items, comparator);
  $.each(items, function(i, li){
    $(listId).append(li);
  });
  e.addClass(checkedClass);
}

function sortItems(items, comparator) {
  items.sort(function(a,b) {
    return comparator(a,b);
  });
  return items;
}

function chooseComparator(e) {
  if (e.hasClass(alphabetSortClass)) {
    if (e.hasClass(lowestFirstClass))
      return alphabetComparator;
    else if (e.hasClass(highestFirstClass))
      return reverseAlphabetComparator;
  }

  if (e.hasClass(valueSortClass)) {
    if (e.hasClass(lowestFirstClass))
      return valueComparator;
    else if (e.hasClass(highestFirstClass))
      return reverseValueComparator;
  }
}

function alphabetComparator(a,b) {
  var keyA = $(a).find(nameClass).text().toLowerCase();
  var keyB = $(b).find(nameClass).text().toLowerCase();
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
}

function reverseAlphabetComparator(a,b) {
  return -alphabetComparator(a,b);
}

function valueComparator(a,b) {
  var keyA = parseInt($(a).find(valueClass).text());
  var keyB = parseInt($(b).find(valueClass).text());
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
}

function reverseValueComparator(a,b) {
  return -valueComparator(a,b);
}
