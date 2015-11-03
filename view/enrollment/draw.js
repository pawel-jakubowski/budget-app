var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var enrollmentClass = tools.enrollmentClass;
var nameClass = tools.nameClass;
var currency = "$";

$(document).ready(function() {
  $(document).on(viewEvents.addValidIncome.type, function(e) {
    printIncome(e.name, e.value);
  });

  $(document).on(viewEvents.addValidOutcome.type, function(e) {
    printOutcome(e.name, e.value);
  });

  $(document).on(viewEvents.drawSums.type, function(e) {
    $("#" + tools.incomesSumId).text(getValueWithCurrency(e.incomesSum));
    $("#" + tools.outcomesSumId).text(getValueWithCurrency(e.outcomesSum));
    $("#" + tools.generalSumId).text(getValueWithCurrency(e.generalSum));
  });
});

module.exports = {
  printFromData: printFromData,
  print: print,
  setCurrency: setCurrency
}

function printFromData(data) {
  $.each(data.incomes, function(key, income) {
    printIncome(income);
  });
  $.each(data.outcomes, function(key, outcome) {
    printOutcome(outcome);
  });
}

function print(enrollment) {
  if(enrollment.type === "income")
    printIncome(enrollment);
  else if(enrollment.type === "outcome")
    printOutcome(enrollment);
}

function setCurrency(newCurrency) {
  currency = newCurrency;
}

function printIncome(income) {
  console.log("print income");
  var enrollment = $(getEnrollmentString(income));
  enrollment.appendTo(incomesId);
};

function printOutcome(outcome) {
  console.log("print outcome");
  var enrollment = $(getEnrollmentString(outcome));
  enrollment.appendTo(outcomesId);
}

function getEnrollmentString(e) {
  var enrollment =
    '<div class="' + enrollmentClass + ' row">' +
      '<div class="col-xs-1 btn-group" data-toggle="buttons">' +
        tools.pinButton(e.pinned) +
      '</div>' +
      '<div class="' + nameClass + ' col-xs-8">' + e.name + '</div>' +
      '<div class="col-xs-2">' + getValueWithCurrency(e.value) + '</div>' +
      '<div class="col-xs-1">' + tools.deleteButton + '</div>' +
    '</div>';
  return enrollment;
}

function getValueWithCurrency(value) {
  return value + currency;
}
