var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var enrollmentClass = tools.enrollmentClass;
var nameClass = tools.nameClass;
var valueClass = tools.valueClass;
var iconClass = tools.iconClass;
var currency = "$";

$(document).ready(function() {
  $(document).on(viewEvents.addValidIncome.type, function(e) {
    printIncome(e.income);
  });

  $(document).on(viewEvents.addValidOutcome.type, function(e) {
    printOutcome(e.outcome);
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
  setCurrency: setCurrency,
  getValueWithCurrency: getValueWithCurrency
}

function printFromData(data) {
  $(incomesId).empty();
  $(outcomesId).empty();

  $.each(data.incomes, function(key, income) {
    printIncome(income);
  });
  $.each(data.outcomes, function(key, outcome) {
    printOutcome(outcome);
  });

  $(document).trigger(viewEvents.enrollmentsDrawed);
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
  var enrollment = $(getEnrollmentString(income, "income"));
  enrollment.appendTo(incomesId);
};

function printOutcome(outcome) {
  console.log("print outcome");
  var enrollment = $(getEnrollmentString(outcome, "outcome"));
  enrollment.appendTo(outcomesId);
}

function getEnrollmentString(e, type) {
  var icon = type === "income" ? "account_balance_wallet" : "receipt";
  var enrollment =
    '<li class="mdl-list__item ' + enrollmentClass + '">' +
      '<span class="mdl-list__item-primary-content">' +
        '<span>' +
          '<i class="' + iconClass + ' material-icons mdl-dark mdl-list__item-icon">' + icon + '</i>' +
          '<button class="mdl-button mdl-js-button mdl-list__item-icon ' +
            tools.deleterClass + '">' +
            '<i class="material-icons">delete</i>' +
          '</button>' +
        '</span>' +
        '<span class="' + nameClass + '">' + e.name + '</span>' +
      '</span>' +
      '<span class="mdl-list__item-secondary-action">' +
        '<span class="' + valueClass + '">' + getValueWithCurrency(e.value) + '</span>' +
      '</span>' +
    '</li>';
  return enrollment;
}

function getValueWithCurrency(value) {
  return value + currency;
}
