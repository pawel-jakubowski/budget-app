var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var deleterClass = "." + tools.enrollmentClass + " " + tools.deleterClass;

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
});

function deleteEnrollment(deleteObject) {
  var enrollment = deduceEnrollmentFromChild(deleteObject);
  var name = getEnrollmentName(enrollment);
  enrollment.remove();
  return name;
}
