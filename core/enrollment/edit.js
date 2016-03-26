var settings = appRequire("settings.js");
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;

$(document).on(coreEvents.viewReady.type, function(){
  $(document).on(viewEvents.editIncome.type, function(e){
    $(document).trigger(coreEvents.updateIncomesSum);
  });

  $(document).on(viewEvents.editOutcome.type, function(e){
    editOutcomeFromAccount(e);
    $(document).trigger(coreEvents.updateOutcomesSum);
  });
});

function editEnrollment(e, container) {
  var i = findEnrollmentIndex(e.oldName, container);
  container[i] = e.newEnrollment;
  return container;
}

function findEnrollmentIndex(name, container) {
  for (var i = 0, len = container.length; i < len; i++) {
      if (container[i].name === name)
          return i;
  }
  return null;
}

function editIncomeFromAccount(e) {
  var enrollments = settings.getCurrentEnrollments();
  enrollments.incomes = editEnrollment(e, enrollments.incomes);
  settings.saveCurrentEnrollments(enrollments);
}

function editOutcomeFromAccount(e) {
  var enrollments = settings.getCurrentEnrollments();
  enrollments.outcomes = editEnrollment(e, enrollments.outcomes);
  settings.saveCurrentEnrollments(enrollments);
}
