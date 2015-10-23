var tools = require("./enrollment/tools.js");
var viewEvents = require("./events.js");
var incomesId = "#incomes";
var outcomesId = "#outcomes";
var enrollmentClass = "enrollment";
var deleterClass = "." + enrollmentClass + " " + tools.deleterClass;
var pinClass = "." + enrollmentClass + " " + tools.pinClass;
var nameClass = "name";
var currency = "$";

$(document).ready(function() {
  $(incomesId).on("click", deleterClass, function(){
    console.log("Income delete");
    viewEvents.deleteIncome.name = deleteEnrollment($(this));
    $(document).trigger(viewEvents.deleteIncome);
  });

  $(outcomesId).on("click", deleterClass, function(){
    console.log("Outcome delete");
    viewEvents.deleteOutcome.name = deleteEnrollment($(this));
    $(document).trigger(viewEvents.deleteOutcome);
  });

  $(incomesId).on("change", pinClass, function(){
    console.log("Income pin");
    var enrollment = deduceEnrollmentFromChild($(this));
    viewEvents.pinIncome.name = getEnrollmentName(enrollment);
    $(document).trigger(viewEvents.pinIncome);
  });

  $(outcomesId).on("change", pinClass, function(){
    console.log("Outcome pin");
    var enrollment = deduceEnrollmentFromChild($(this));
    viewEvents.pinOutcome.name = getEnrollmentName(enrollment);
    $(document).trigger(viewEvents.pinOutcome);
  });

  $(document).on(viewEvents.drawSums.type, function(e) {
    $("#incomes-sum").text(getValueWithCurrency(e.incomesSum));
    $("#outcomes-sum").text(getValueWithCurrency(e.outcomesSum));
    $("#general-sum").text(getValueWithCurrency(e.generalSum));
  });

  $(document).on(viewEvents.addValidIncome.type, function(e) {
    addIncome(e.name, e.value);
  });

  $(document).on(viewEvents.addValidOutcome.type, function(e) {
    addOutcome(e.name, e.value);
  });
});

function deleteEnrollment(deleteObject) {
  var enrollment = deduceEnrollmentFromChild(deleteObject);
  var name = getEnrollmentName(enrollment);
  enrollment.remove();
  return name;
}

function deduceEnrollmentFromChild(object) {
  return object.parents("." + enrollmentClass);
}

function getEnrollmentName(enrollment) {
  return enrollment.children("." + nameClass).text();
}

module.exports = {
  init: init,
  setCurrency: setCurrency,
  add: add,
  addIncome: addIncome,
  addOutcome: addOutcome
}

function init(data) {
  setCurrency(data.currency);
  printFromData(data);
  $(incomesId).sortable({start: sortStart, change: incomesSortApply, helper: 'clone'});
  $(outcomesId).sortable({start: sortStart, change: outcomesSortApply, helper: 'clone'});
}

function setCurrency(newCurrency) {
  currency = newCurrency;
}

function printFromData(data) {
  $.each(data.incomes, function(key, income) {
    addIncome(income.name, income.value);
  });
  $.each(data.outcomes, function(key, outcome) {
    addOutcome(outcome.name, outcome.value);
  });
}

function sortStart(event, ui) {
    ui.item.fromIndex = ui.item.index();
}

function incomesSortApply(event, ui) {
  var index = ui.placeholder.index();
  index = ((ui.item.fromIndex < index) ? index - 1 : index);

  viewEvents.moveIncomes.from = ui.item.fromIndex;
  viewEvents.moveIncomes.to = index;
  $(document).trigger(viewEvents.moveIncomes);
  ui.item.fromIndex = index;
}

function outcomesSortApply(event, ui) {
  var index = ui.placeholder.index();
  index = ((ui.item.fromIndex < index) ? index - 1 : index);

  viewEvents.moveOutcomes.from = ui.item.fromIndex;
  viewEvents.moveOutcomes.to = index;
  $(document).trigger(viewEvents.moveOutcomes);
  ui.item.fromIndex = index;
}

function getEnrollmentString(name, value) {
  var enrollment =
    '<div class="' + enrollmentClass + ' row">' +
      '<div class="col-xs-1 btn-group" data-toggle="buttons">' + tools.pinButton + '</div>' +
      '<div class="' + nameClass + ' col-xs-8">' + name + '</div>' +
      '<div class="col-xs-2">' + getValueWithCurrency(value) + '</div>' +
      '<div class="col-xs-1">' + tools.deleteButton + '</div>' +
    '</div>';
  return enrollment;
}

function getValueWithCurrency(value) {
  return value + currency;
}

function add(name, value, type) {
  if(type === "income")
    addIncome(name, value);
  else if(type === "outcome")
    addOutcome(name, value);
}

function addIncome(name, value) {
  console.log("add income");
  var enrollment = $(getEnrollmentString(name, value));
  enrollment.appendTo(incomesId);
};

function addOutcome(name, value) {
  console.log("add outcome");
  var enrollment = $(getEnrollmentString(name, value));
  enrollment.appendTo(outcomesId);
}
