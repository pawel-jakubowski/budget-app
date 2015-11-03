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
  var accountData = settings.getAccount();
  console.log("Delete from settings income: " + name);
  accountData.incomes = deleteEnrollmentByName(name, accountData.incomes);
  settings.saveAccount(accountData);
}

function deleteOutcomeFromAccount(name) {
  var accountData = settings.getAccount();
  console.log("Delete from settings outcome: " + name);
  accountData.outcomes = deleteEnrollmentByName(name, accountData.outcomes);
  settings.saveAccount(accountData);
}
