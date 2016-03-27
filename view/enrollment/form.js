var viewEvents = appRequire("view/events.js");
var dialog = appRequire("utils/scripts/dialog.js");
var tools = require("./tools.js");

var accountView = {};
var form = {};

var formId = "#addEnrollmentForm";
var formCurrencyId = "#form-currency";
var nameInputId = "#name";
var valueInputId = "#value";
var typeId = "input:radio[name=enrollment-type]:checked";
var addDialogId = "#addDialog";
var addButtonId = "#addEntityFab";
var saveId = "#addEnrollmentSubmit";
var cancelId = addDialogId + " .close";

$(document).ready(function() {
  form = $(formId);
  dialog.bindDialog(addDialogId, addButtonId);

  form.submit(function(e) {
    e.preventDefault();
    raiseAddEvent(getName(), getValue(), getType());
  });

  $(addButtonId).click(function() {
    var enterKey = 13;
    var escapeKey = 27;
    tools.bindKeys([enterKey, escapeKey], [saveId, cancelId]);
  });

  $(saveId).click(function() {
    form.submit();
  });

  $(cancelId).click(function() {
    tools.unbindKeys();
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
  setAccountView: setAccountView,
  setCurrency: setCurrency
}

function setAccountView(view) {
  accountView = view;
}

function setCurrency(currency) {
  $(formCurrencyId).text(currency);
};

function getName() {
  return form.find(nameInputId).val();
}

function getValue() {
  return parseInt(form.find(valueInputId).val());
}

function getType() {
  return form.find(typeId).val();
}
