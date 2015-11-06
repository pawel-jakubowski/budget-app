var settings = appRequire("settings.js");
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;

$(document).on(coreEvents.viewReady.type, function() {
  $(document).on(viewEvents.moveIncomes.type, function(e) {
    var data = settings.getCurrentEnrollments();
    data.incomes = move(e.from, e.to, data.incomes);
    settings.saveCurrentEnrollments(data);
  });

  $(document).on(viewEvents.moveOutcomes.type, function(e) {
    var data = settings.getCurrentEnrollments();
    data.outcomes = move(e.from, e.to, data.outcomes);
    settings.saveCurrentEnrollments(data);
  });
});

function move(fromIndex, toIndex, container) {
  console.log("move from: " + fromIndex + " to: " + toIndex);
  container.splice(toIndex, 0, container.splice(fromIndex, 1)[0] );
  return container;
}
