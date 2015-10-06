var accountView = {};
var form = {};
var viewEvents = require("./../events.js");
var formId = "#addEnrollmentForm";
var nameInputId = "#name";
var valueInputId = "#value";
var typeId = "input:radio[name=enrollment-type]:checked";

$(document).ready(function() {
  form = $(formId);
  form.submit(function(e) {
    e.preventDefault();
    raiseAddEvent(getName(), getValue(), getType());
  });
});

function raiseAddEvent(name, value, type) {
  if(type === "income")
    raiseAddIncomeEvent(name, value);
  else if(type === "outcome")
    raiseAddOutcomeEvent(name, value);
}

function raiseAddIncomeEvent(name, value) {
  viewEvents.addIncome.name = name;
  viewEvents.addIncome.value = value;
  $(document).trigger(viewEvents.addIncome);
}

function raiseAddOutcomeEvent(name, value) {
  viewEvents.addOutcome.name = name;
  viewEvents.addOutcome.value = value;
  $(document).trigger(viewEvents.addOutcome);
}

module.exports = {
  setAccountView: setAccountView
}

function setAccountView(view) {
  accountView = view;
}

function getName() {
  return form.find(nameInputId).val()
}

function getValue() {
  return parseInt(form.find(valueInputId).val())
}

function getType() {
  return form.find(typeId).val();
}
