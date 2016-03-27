var settings = appRequire("settings.js");
var viewEvents = appRequire("view/events.js");
var tools = require("./tools.js");
var draw = require("./draw.js");
var incomesId = "#" + tools.incomesId;
var outcomesId = "#" + tools.outcomesId;
var deleterClass = "." + tools.enrollmentClass + " ." + tools.deleterClass;
var iconClass = "." + tools.enrollmentClass + " ." + tools.iconClass;
var enrollmentClass = "." + tools.enrollmentClass;

var hiddenClass = "hidden";

var buttonsClass = ".button-group";
var baseButtonsClass = ".base";
var deleteButtonsClass = ".delete";
var deleteId = "#delete";
var saveId = "#delete-ok";
var cancelId = "#delete-cancel";

var deletedIncomes = [];
var deletedOutcomes = [];

$(document).on(viewEvents.enrollmentsDrawed.type, function() {
  deleteButtonGroup = $(buttonsClass + deleteButtonsClass);
  baseButtonGroup = $(buttonsClass + baseButtonsClass);
  deleteButtonGroup.hide();

  enrollmentsDeleteModeOff();

  $(deleteId).click(function() {
    deletedIncomes = [];
    deletedOutcomes = [];
    enrollmentsDeleteModeOn();
    deleteButtonGroup.show();
    baseButtonGroup.hide();
  });

  $(saveId).click(function() {
    saveEnrollments();
    enrollmentsDeleteModeOff();
    deleteButtonGroup.hide();
    baseButtonGroup.show();
  });

  $(cancelId).click(function() {
    var data = settings.getCurrentEnrollments();
    draw.printFromData(data);
    enrollmentsDeleteModeOff();
    deleteButtonGroup.hide();
    baseButtonGroup.show();
  });

  prepareDeleters();
});

function enrollmentsDeleteModeOn() {
  $(deleterClass).removeClass(hiddenClass);
  $(iconClass).hide();
  var enterKey = 13;
  var escapeKey = 27;
  tools.bindKeys([enterKey, escapeKey], [saveId, cancelId]);
}

function enrollmentsDeleteModeOff() {
  $(deleterClass).addClass(hiddenClass);
  $(iconClass).show();
  tools.unbindKeys();
}

function saveEnrollments() {
  $.each(deletedIncomes, function(i){
    viewEvents.deleteIncome.name = deletedIncomes[i];
    $(document).trigger(viewEvents.deleteIncome);
  });
  $.each(deletedOutcomes, function(i){
    viewEvents.deleteOutcome.name = deletedOutcomes[i];
    $(document).trigger(viewEvents.deleteOutcome);
  });
}

function prepareDeleters() {
  $(incomesId).on("click", deleterClass, function(){
    console.log("Income delete");
    deletedIncomes.push(deleteEnrollment($(this)));
  });

  $(outcomesId).on("click", deleterClass, function(){
    console.log("Outcome delete");
    deletedOutcomes.push(deleteEnrollment($(this)));
  });
}

function deleteEnrollment(deleteObject) {
  var enrollment = deduceEnrollmentFromChild(deleteObject);
  var name = getEnrollmentName(enrollment);
  enrollment.remove();
  return name;
}

function deduceEnrollmentFromChild(object) {
  return object.parents("." + tools.enrollmentClass);
}

function getEnrollmentName(enrollment) {
  return enrollment.find("." + tools.nameClass).text();
}
