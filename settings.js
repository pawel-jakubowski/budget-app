var fs = require("fs");
var events = {
  settingsLoaded: jQuery.Event("settings-loaded")
};
var account = {};
var currentDate = "02.1992"; //fixed rigth now
var settingsFile = __dirname+"/settings/account.json";

$.getJSON(settingsFile).then(function(data) {
  console.log(data);
  account = data;
  $(document).trigger(events.settingsLoaded);
});

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
  return account;
};

function getCurrentEnrollments() {
  var enrollments = {};
  enrollments.incomes = [];
  enrollments.outcomes = [];

  console.log("Return enrollments:");

  if(isOldFormat(account.incomes))
    enrollments.incomes = account.incomes;
  else {
    $.map(account.incomes, function(incomesGroup, index) {
      if (incomesGroup.date === currentDate)
        enrollments.incomes = incomesGroup.enrollments;
    });
  }

  if(isOldFormat(account.outcomes))
    enrollments.outcomes = account.outcomes;
  else {
    $.map(account.outcomes, function(outcomesGroup, index) {
      if (outcomesGroup.date === currentDate)
        enrollments.outcomes = outcomesGroup.enrollments;
    });
  }

  return enrollments;
};

function isOldFormat(enrollmentContainer) {
  if(enrollmentContainer.lenght > 0 && !enrollmentContainer[0].hasOwnProperty("date")) {
    console.log("Old data format detected!");
    return true;
  }
  return false;
}

function setCurrentDate(date) {
  console.log("new date: " + date);
  currentDate = date;
}

function saveCurrentEnrollments(enrollments) {
  currentDate = currentDate;

  var currentIncome = 0;
  if (!isOldFormat(account.incomes))
    currentIncome = findCurrentEnrollmentIndex(account.incomes);
  account.incomes[currentIncome] = {};
  account.incomes[currentIncome].date = currentDate;
  account.incomes[currentIncome].enrollments = enrollments.incomes;

  var currentOutcome = 0;
  if (!isOldFormat(account.outcomes))
    currentOutcome = findCurrentEnrollmentIndex(account.incomes);
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
  var strJson = JSON.stringify(newAccount, null, 4);
  fs.writeFileSync(settingsFile, strJson);
  account = newAccount;
}
