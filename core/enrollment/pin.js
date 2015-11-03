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
  var accountData = settings.getAccount();
  console.log((pinned ? "Pin" : "Unpin") + " settings income: " + name);
  changeEnrollmentByName(name, pinned, accountData.incomes);
  settings.saveAccount(accountData);
}

function changePinOutcomeState(name, pinned) {
  var accountData = settings.getAccount();
  console.log((pinned ? "Pin" : "Unpin") + " settings outcome: " + name);
  changeEnrollmentByName(name, pinned, accountData.outcomes);
  settings.saveAccount(accountData);
}
