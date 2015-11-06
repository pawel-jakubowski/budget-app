var settings = appRequire("settings.js");
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;

$(document).on(coreEvents.viewReady.type, function(){
  $(document).on(viewEvents.deleteIncome.type, function(e){
    deleteIncomeFromAccount(e.name);
    $(document).trigger(coreEvents.updateIncomesSum);
  });

  $(document).on(viewEvents.deleteOutcome.type, function(e){
    deleteOutcomeFromAccount(e.name);
    $(document).trigger(coreEvents.updateOutcomesSum);
  });
});

function deleteEnrollmentByName(name, container) {
  container = $.grep(container, function(e){ return e.name != name; });
  return container;
}

function deleteIncomeFromAccount(name) {
  var enrollments = settings.getCurrentEnrollments();
  console.log("Delete from settings income: " + name);
  enrollments.incomes = deleteEnrollmentByName(name, enrollments.incomes);
  settings.saveCurrentEnrollments(enrollments);
}

function deleteOutcomeFromAccount(name) {
  var enrollments = settings.getCurrentEnrollments();
  console.log("Delete from settings outcome: " + name);
  enrollments.outcomes = deleteEnrollmentByName(name, enrollments.outcomes);
  settings.saveCurrentEnrollments(enrollments);
}
