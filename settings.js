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
  return account;
};

function getCurrentEnrollments() {
  var enrollments = {};
  enrollments.incomes = [];
  enrollments.outcomes = [];
  $.map(account.incomes, function(incomesGroup, index) {
    if (incomesGroup.date === currentDate || incomesGroup.date === "pinned") {
      enrollments.incomes = enrollments.incomes.concat(incomesGroup.enrollments);
    }
  });

  $.map(account.outcomes, function(outcomesGroup, index) {
    if (outcomesGroup.date === currentDate || outcomesGroup.date === "pinned")
      enrollments.outcomes = enrollments.outcomes.concat(outcomesGroup.enrollments);
  });
  return enrollments;
};

function setCurrentDate(date) {
  currentDate = date;
}

function saveCurrentEnrollments(enrollments) {
  var separatedIncomes = extractPinned(enrollments.incomes);

  var pinnedIndex = getPinnedIndex(account.incomes);
  account.incomes[pinnedIndex] = separatedIncomes.pinned;

  var currentIncome = findCurrentEnrollmentIndex(account.incomes);
  account.incomes[currentIncome] = separatedIncomes.unpinned;


  var separatedOutcomes = extractPinned(enrollments.outcomes);

  var pinnedIndex = getPinnedIndex(account.outcomes);
  account.outcomes[pinnedIndex] = separatedOutcomes.pinned;

  var currentOutcome = findCurrentEnrollmentIndex(account.outcomes);
  account.outcomes[currentOutcome] = separatedOutcomes.unpinned;

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

function getPinnedIndex(container) {
  var pinnedGroup = {date: "pinned", enrollments: []};
  var pinnedIndex = -1;
  $.map(account.incomes, function(value, index){
    if(value.hasOwnProperty("date") && value.date === "pinned")
      pinnedIndex = index;
  });
  if(pinnedIndex === -1) {
    account.incomes.unshift(pinnedGroup);
    pinnedIndex = 0;
  }
  return pinnedIndex;
}

function extractPinned(container) {
  var separatedContainer = {};
  separatedContainer.pinned = {
    date: "pinned",
    enrollments: []
  };
  separatedContainer.unpinned = {
    date: currentDate,
    enrollments: []
  };
  $.map(container, function(value, index){
    if(value.pinned)
      separatedContainer.pinned.enrollments.push(value);
    else
      separatedContainer.unpinned.enrollments.push(value);
  });
  return separatedContainer;
}

function saveAccount(newAccount) {
  var strJson = JSON.stringify(newAccount, null, 4);
  fs.writeFileSync(settingsFile, strJson);
  account = newAccount;
}
