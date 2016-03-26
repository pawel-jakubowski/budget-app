var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var draw = require("./draw.js");
var enrollmentClass = "." + tools.enrollmentClass;
var nameClass = "." + tools.nameClass;
var valueClass = "." + tools.valueClass;
var nameInputClass = "nameInput";
var valueInputClass = "valueInput";

var editId = "#edit";

$(document).ready(function() {
  $(editId).click(function() {
    var $this = $(this)
    if ($this.is(':checked')) {
      enrollmentsEditModeOn();
    }
    else {
      enrollmentsEditModeOff();
    }
  });
});

function enrollmentsEditModeOn() {
  var names = $(enrollmentClass + " " + nameClass);
  var values = $(enrollmentClass + " " + valueClass);
  changeTextToInput(names, getNameInputString);
  changeTextToInput(values, getValueInputString);
  componentHandler.upgradeDom();
}

function enrollmentsEditModeOff() {
  var names = $(enrollmentClass + " " + nameClass);
  var values = $(enrollmentClass + " " + valueClass);
  changeInputToText(names, "." + nameInputClass, String);
  changeInputToText(values, "." + valueInputClass, draw.getValueWithCurrency);
  componentHandler.upgradeDom();
}

function changeTextToInput(elements, inputGetter) {
  $.each(elements, function(){
    var input = inputGetter($(this).text());
    $(this).html(input);
  });
}

function changeInputToText(elements, inputClass, parser) {
  $.each(elements, function(){
    var input = $(this).find(inputClass);
    console.log(input);
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
