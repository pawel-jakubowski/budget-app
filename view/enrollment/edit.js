var settings = appRequire("settings.js");
var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var draw = require("./draw.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var enrollmentClass = "." + tools.enrollmentClass;
var editClass = "edit";
var nameClass = "." + tools.nameClass;
var valueClass = "." + tools.valueClass;
var nameInputClass = "nameInput";
var valueInputClass = "valueInput";

var editId = "#edit";
var buttonsClass = ".button-group";
var baseButtonsClass = ".base";
var editButtonsClass = ".edit";
var saveId = "#edit-ok";
var cancelId = "#edit-cancel";

$(document).ready(function() {
  editButtonGroup = $(buttonsClass + editButtonsClass);
  otherButtonGroup = $(buttonsClass + baseButtonsClass);
  editButtonGroup.hide();

  $(editId).click(function() {
    enrollmentsEditModeOn();
    editButtonGroup.show();
    otherButtonGroup.hide();
  });

  $(saveId).click(function() {
    saveEnrollments();
    enrollmentsEditModeOff();
    editButtonGroup.hide();
    otherButtonGroup.show();
  });

  $(cancelId).click(function() {
    var data = settings.getCurrentEnrollments();
    draw.printFromData(data);
    editButtonGroup.hide();
    otherButtonGroup.show();
  });
});

function enrollmentsEditModeOn() {
  var names = $(enrollmentClass + " " + nameClass);
  var values = $(enrollmentClass + " " + valueClass);

  $.each(names, function(){
    var text = $(this).text();
    $(this).parents(enrollmentClass).attr("old-value", text);
  });

  changeTextToInput(names, getNameInputString);
  changeTextToInput(values, getValueInputString);
  $(enrollmentClass).addClass(editClass);
  componentHandler.upgradeDom();
}

function enrollmentsEditModeOff() {
  var names = $(enrollmentClass + " " + nameClass);
  var values = $(enrollmentClass + " " + valueClass);
  changeInputToText(names, "." + nameInputClass, String);
  changeInputToText(values, "." + valueInputClass, draw.getValueWithCurrency);
  $(enrollmentClass).removeClass(editClass);
  componentHandler.upgradeDom();
}

function saveEnrollments() {
  var enrollments = $(enrollmentClass);
  $.each(enrollments, function(){
    var enrollmentOldName = $(this).attr("old-value");
    var enrollmentName = $(this).find("." + nameInputClass).val();
    var enrollmentValue = parseInt($(this).find("." + valueInputClass).val());
    var newEnrollment = { name: enrollmentName, value: enrollmentValue };
    var type = $(this).parents(incomesId);
    if (type.length === 1) // Income
      saveIncome(enrollmentOldName, newEnrollment);
    else
      saveOutcome(enrollmentOldName, newEnrollment);
  });
}

function saveIncome(oldName, newEnrollment) {
  viewEvents.editIncome.oldName = oldName;
  viewEvents.editIncome.newEnrollment = newEnrollment;
  $(document).trigger(viewEvents.editIncome);
}

function saveOutcome(oldName, newEnrollment) {
  viewEvents.editOutcome.oldName = oldName;
  viewEvents.editOutcome.newEnrollment = newEnrollment;
  $(document).trigger(viewEvents.editOutcome);
}

function changeTextToInput(elements, inputGetter) {
  $.each(elements, function(){
    var text = $(this).text();
    var input = inputGetter(text);
    $(this).html(input);
  });
}

function changeInputToText(elements, inputClass, parser) {
  $.each(elements, function(){
    var input = $(this).find(inputClass);
    $(this).html(parser(input.val()));
  });
}

function getNameInputString(e) {
  return getTextInputString(e, nameInputClass, "Nazwa");
}

function getValueInputString(e) {
  return getNumberInputString(parseInt(e), valueInputClass, "zł", "[0-9]*", "");
}

function getTextInputString(e, inputClass, label) {
  var input =
    '<div class="mdl-textfield mdl-js-textfield">' +
      '<input class="' + inputClass + ' mdl-textfield__input" type="text" value="' + e + '">' +
      '<label class="mdl-textfield__label">' + label + '</label>' +
    '</div>';
  return input;
}

function getNumberInputString(e, inputClass, label, pattern, errorMsg) {
  var input =
    '<div class="mdl-textfield mdl-js-textfield">' +
      '<input class="' + inputClass + ' mdl-textfield__input" type="text" ' +
        'pattern="' + pattern + '" ' +
        'value="' + e + '">' +
      '<label class="mdl-textfield__label">' + label + '</label>' +
      '<span class="mdl-textfield__error">' + errorMsg + '</span>' +
    '</div>';
  return input;
}
