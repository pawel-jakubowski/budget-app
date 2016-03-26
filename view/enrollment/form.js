var accountView = {};
var form = {};
var viewEvents = appRequire("view/events.js");
var formId = "#addEnrollmentForm";
var formCurrencyId = "#form-currency";
var nameInputId = "#name";
var valueInputId = "#value";
var typeId = "input:radio[name=enrollment-type]:checked";
var addButtonId = "#addDialog";
var addDialogId = "#addEntityFab";

$(document).ready(function() {
  form = $(formId);

  var dialog = document.querySelector(addButtonId);
  var showDialogButton = document.querySelector(addDialogId);
  showDialogButton.addEventListener('click', function() {
    dialog.showModal();
  });
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });

  form.submit(function(e) {
    e.preventDefault();
    raiseAddEvent(getName(), getValue(), getType());
  });

  $("#addEnrollmentSubmit").click(function() {
      console.log('submit');
      form.submit();
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
  return form.find(nameInputId).val()
}

function getValue() {
  return parseInt(form.find(valueInputId).val())
}

function getType() {
  return form.find(typeId).val();
}
