Date.prototype.getSettingsDate = function() {
   var mm = (this.getMonth()+1).toString();
   var yyyy = this.getFullYear().toString();
   return (mm[1]?mm:"0"+mm[0]) + "." + yyyy;
};

var fs = require("fs");
var events = {
  settingsLoaded: jQuery.Event("settings-loaded")
};
var account = {};
var currentDate = new Date().getSettingsDate(); //fixed rigth now
var settingsFile = __dirname+"/settings/account.json";

$.getJSON(settingsFile).then(function(data) {
  account = data;
  if(isOldFormat(account.incomes) || isOldFormat(account.outcomes)) {
    account = translateFromOldFormat(account);
    saveAccount(account);
  }
  $(document).trigger(events.settingsLoaded);
});

function isOldFormat(enrollmentContainer) {
  if(enrollmentContainer.length > 0 &&
    !enrollmentContainer[0].hasOwnProperty("date")) {
    console.log("Old data format detected!");
    return true;
  }
  return false;
}

function translateFromOldFormat(oldAccount) {
  oldAccount.incomes = [{
    date: currentDate,
    enrollments: oldAccount.incomes
  }];
  oldAccount.outcomes = [{
    date: currentDate,
    enrollments: oldAccount.outcomes
  }];
  return oldAccount;
}

module.exports = {
  settingsEvents: events,
  coreEvents: require("./core/events.js"),
  viewEvents: require("./view/events.js"),
  getAccount: getAccount,
  getCurrentEnrollments: getCurrentEnrollments,
  setCurrentDate: setCurrentDate,
  saveCurrentEnrollments: saveCurrentEnrollments,
  saveAccount: saveAccount
}

function getAccount() {
  console.log("get");
  console.log(account);
  return account;
};

function getCurrentEnrollments() {
  var enrollments = {};
  enrollments.incomes = [];
  enrollments.outcomes = [];

  $.map(account.incomes, function(incomesGroup, index) {
    if (incomesGroup.date === currentDate)
      enrollments.incomes = incomesGroup.enrollments;
  });

  $.map(account.outcomes, function(outcomesGroup, index) {
    if (outcomesGroup.date === currentDate)
      enrollments.outcomes = outcomesGroup.enrollments;
  });

  return enrollments;
};

function setCurrentDate(date) {
  currentDate = date;
}

function saveCurrentEnrollments(enrollments) {
  currentDate = currentDate;

  var currentIncome = findCurrentEnrollmentIndex(account.incomes);
  account.incomes[currentIncome] = {};
  account.incomes[currentIncome].date = currentDate;
  account.incomes[currentIncome].enrollments = enrollments.incomes;

  var currentOutcome = findCurrentEnrollmentIndex(account.incomes);
  account.outcomes[currentOutcome] = {};
  account.outcomes[currentOutcome].date = currentDate;
  account.outcomes[currentOutcome].enrollments = enrollments.outcomes;

  saveAccount(account);
}

function findCurrentEnrollmentIndex(enrollmentsContainer) {
  var current = enrollmentsContainer.length;
  $.map(enrollmentsContainer, function(value, index){
    if(value.hasOwnProperty("date") && value.date === currentDate)
      current = index;
  });
  return current;
}

function saveAccount(newAccount) {
  console.log(newAccount);
  var strJson = JSON.stringify(newAccount, null, 4);
  fs.writeFileSync(settingsFile, strJson);
  account = newAccount;
}
