var fs = require("fs");
var events = {
  settingsLoaded: jQuery.Event("settings-loaded")
};
var account = {};
var currentDate = "11.2015"; //fixed rigth now
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

  if(!isOldFormat(account.incomes))
    enrollments.incomes = account.incomes;
  else {
    $.map(account.incomes, function(incomesGroup, index) {
      if (incomesGroup.date === currentDate)
        enrollments.incomes = incomesGroup.enrollments;
    });
  }

  if(!isOldFormat(account.outcomes))
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
  return !enrollmentContainer.hasOwnProperty("date");
}

function setCurrentDate(date) {
  console.log("new date: " + date);
  currentDate = date;
}

function saveCurrentEnrollments(enrollments) {
  currentDate = "11.2015"; //fixed for now

  account.incomes.date = currentDate;
  account.incomes.enrollments = enrollments.incomes;

  account.outcomes.date = currentDate;
  account.outcomes.enrollments = enrollments.outcomes;

  saveAccount(account);
}

function saveAccount(newAccount) {
  var strJson = JSON.stringify(newAccount, null, 4);
  fs.writeFileSync(settingsFile, strJson);
  account = newAccount;
}
