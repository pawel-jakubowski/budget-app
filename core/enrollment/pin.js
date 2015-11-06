var settings = appRequire("settings.js");
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;

$(document).on(coreEvents.viewReady.type, function(){
  $(document).on(viewEvents.pinIncome.type, function(e){
    changePinIncomeState(e.name, e.pinned);
  });

  $(document).on(viewEvents.pinOutcome.type, function(e){
    changePinOutcomeState(e.name, e.pinned);
  });
});

function changeEnrollmentByName(name, pinned, container) {
  for (var i = 0; i < container.length; i++) {
    if (container[i].name === name)
      container[i].pinned = pinned;
  }
}

function changePinIncomeState(name, pinned) {
  var enrollments = settings.getCurrentEnrollments();
  console.log((pinned ? "Pin" : "Unpin") + " settings income: " + name);
  changeEnrollmentByName(name, pinned, enrollments.incomes);
  settings.saveCurrentEnrollments(enrollments);
}

function changePinOutcomeState(name, pinned) {
  var enrollments = settings.getCurrentEnrollments();
  console.log((pinned ? "Pin" : "Unpin") + " settings outcome: " + name);
  changeEnrollmentByName(name, pinned, enrollments.outcomes);
  settings.saveCurrentEnrollments(enrollments);
}
