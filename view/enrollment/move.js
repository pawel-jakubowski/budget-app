var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;

module.exports = {
  init: init
}

function init() {
  $(incomesId).sortable({start: sortStart, change: incomesSortApply, helper: 'clone'});
  $(outcomesId).sortable({start: sortStart, change: outcomesSortApply, helper: 'clone'});
}

function sortStart(event, ui) {
    ui.item.fromIndex = ui.item.index();
}

function incomesSortApply(event, ui) {
  var index = ui.placeholder.index();
  index = ((ui.item.fromIndex < index) ? index - 1 : index);

  viewEvents.moveIncomes.from = ui.item.fromIndex;
  viewEvents.moveIncomes.to = index;
  $(document).trigger(viewEvents.moveIncomes);
  ui.item.fromIndex = index;
}

function outcomesSortApply(event, ui) {
  var index = ui.placeholder.index();
  index = ((ui.item.fromIndex < index) ? index - 1 : index);

  viewEvents.moveOutcomes.from = ui.item.fromIndex;
  viewEvents.moveOutcomes.to = index;
  $(document).trigger(viewEvents.moveOutcomes);
  ui.item.fromIndex = index;
}
