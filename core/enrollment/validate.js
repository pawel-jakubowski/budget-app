var settings = appRequire("settings.js");

module.exports = {
  isIncomeValid: isIncomeValid,
  isOutcomeValid: isOutcomeValid
}

function isIncomeValid(name, value) {
  return isIncomeNameValid(name) && isValueValid(value);
}

function isOutcomeValid(name, value) {
  return isOutcomeNameValid(name) && isValueValid(value);
}

function isIncomeNameValid(name) {
  return isNameUniqueInContainer(name, settings.getCurrentEnrollments().incomes);
}

function isOutcomeNameValid(name) {
  return isNameUniqueInContainer(name, settings.getCurrentEnrollments().outcomes);
}

function isNameUniqueInContainer(name, container) {
  var added=false;
  // $.each(container, function(enrollments, index){
    $.map(container, function(element, index) {
      if (element.name === name)
        added = true;
    });
  // });
  return !added;
}

function isValueValid(value) {
  return !isNaN(value) && value > 0;
}
