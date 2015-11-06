var settings = appRequire("settings.js");

module.exports = {
  isIncomeValid: isIncomeValid,
  isOutcomeValid: isOutcomeValid
}

function isIncomeValid(name, value) {
  return isIncomeNameValid(name);
}

function isOutcomeValid(name, value) {
  return isOutcomeNameValid(name);
}

function isIncomeNameValid(name) {
  return isNameUniqueInContainer(name, settings.getAccount().incomes);
}

function isOutcomeNameValid(name) {
  return isNameUniqueInContainer(name, settings.getAccount().outcomes);
}

function isNameUniqueInContainer(name, container) {
  var added=false;
  // $.each(container, function(enrollments, index){
    $.map(container.enrollments, function(element, index) {
      if (element.name === name)
        added = true;
    });
  // });
  return !added;
}
