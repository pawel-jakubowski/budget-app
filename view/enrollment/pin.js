var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var pinClass = "." + tools.enrollmentClass + " " + tools.pinClass;

$(document).ready(function() {
  $(incomesId).on("change", pinClass, function(){
    processPinChange($(this), viewEvents.pinIncome);
  });

  $(outcomesId).on("change", pinClass, function(){
    processPinChange($(this), viewEvents.pinOutcome);
  });
});

function processPinChange(object, event) {
  var enrollment = deduceEnrollmentFromChild(object);
  event.pinned = $(object).hasClass("active");
  event.name = getEnrollmentName(enrollment);
  $(document).trigger(event);
}

function deduceEnrollmentFromChild(object) {
  return object.parents("." + tools.enrollmentClass);
}

function getEnrollmentName(enrollment) {
  return enrollment.children("." + tools.nameClass).text();
}
