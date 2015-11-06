var settings = appRequire("settings.js");
var fs = require("fs");
var validator = require("./validate.js")
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;

function Enrollment(name, value) {
  this.name = name;
  this.value = value;
};

$(document).on(coreEvents.viewReady.type, function() {
  $(document).on(viewEvents.addIncome.type, function(e) {
    console.log("try add: " + e.name + ", " + e.value);
    if (validator.isIncomeValid(e.name, e.value)) {
      var enrollments = addIncomeToData(e.name, e.value);
      settings.saveCurrentEnrollments(enrollments);
      viewEvents.addValidIncome.income = {};
      viewEvents.addValidIncome.income.name = e.name;
      viewEvents.addValidIncome.income.value = e.value;
      $(document).trigger(viewEvents.addValidIncome);
      $(document).trigger(coreEvents.updateIncomesSum);
    } else {
      $(document).trigger(viewEvents.invalidEnrollment);
    }
  });

  $(document).on(viewEvents.addOutcome.type, function(e) {
    console.log("try add: " + e.name + ", " + e.value);
    if (validator.isOutcomeValid(e.name, e.value)) {
      var enrollments = addOutcomeToData(e.name, e.value);
      settings.saveCurrentEnrollments(enrollments);
      viewEvents.addValidOutcome.outcome = {};
      viewEvents.addValidOutcome.outcome.name = e.name;
      viewEvents.addValidOutcome.outcome.value = e.value;
      $(document).trigger(viewEvents.addValidOutcome);
      $(document).trigger(coreEvents.updateOutcomesSum);
    } else {
      $(document).trigger(viewEvents.invalidEnrollment);
    }
  });
});


function addIncomeToData(name, value) {
  var enrollments = settings.getCurrentEnrollments();
  addEnrollmentToContainer(name, value, enrollments.incomes);
  return enrollments;
}

function addOutcomeToData(name, value) {
  var enrollments = settings.getCurrentEnrollments();
  addEnrollmentToContainer(name, value, enrollments.outcomes);
  return enrollments;
}

function addEnrollmentToContainer(name, value, container) {
  var enrollment = {
    name: name,
    value: value
  }
  container.push(enrollment);
}
