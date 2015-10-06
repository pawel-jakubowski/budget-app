var settings = appRequire("settings.js");
var fs = require("fs");
var validator = require("./validate.js")
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;

function Enrollment(name, value) {
  this.name = name;
  this.value = value;
};

$(document).on(coreEvents.viewReady.type, function() {
  $(document).on(viewEvents.addIncome.type, function(e) {
    console.log("try add: " + e.name + ", " + e.value);
    if (validator.isIncomeValid(e.name, e.value)) {
      var accountData = addIncomeToData(e.name, e.value);
      settings.saveAccount(accountData);
      viewEvents.addValidIncome.name = e.name;
      viewEvents.addValidIncome.value = e.value;
      $(document).trigger(viewEvents.addValidIncome);
      $(document).trigger(coreEvents.updateIncomesSum);
    } else {
      $(document).trigger(viewEvents.invalidEnrollment);
    }
  });

  $(document).on(viewEvents.addOutcome.type, function(e) {
    console.log("try add: " + e.name + ", " + e.value);
    if (validator.isOutcomeValid(e.name, e.value)) {
      var accountData = addOutcomeToData(e.name, e.value);
      settings.saveAccount(accountData);
      viewEvents.addValidOutcome.name = e.name;
      viewEvents.addValidOutcome.value = e.value;
      $(document).trigger(viewEvents.addValidOutcome);
      $(document).trigger(coreEvents.updateOutcomesSum);
    } else {
      $(document).trigger(viewEvents.invalidEnrollment);
    }
  });
});


function addIncomeToData(name, value) {
  var accountData = settings.getAccount();
  addEnrollmentToContainer(name, value, accountData.incomes);
  return accountData;
}

function addOutcomeToData(name, value) {
  var accountData = settings.getAccount();
  addEnrollmentToContainer(name, value, accountData.outcomes);
  return accountData;
}

function addEnrollmentToContainer(name, value, container) {
  var enrollment = {
    name: name,
    value: value
  }
  container.push(enrollment);
}
