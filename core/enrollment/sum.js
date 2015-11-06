var settings = appRequire("settings.js");
var coreEvents = settings.coreEvents;
var viewEvents = settings.viewEvents;
var incomesSum = 0;
var outcomesSum = 0;

$(document).on(coreEvents.viewReady.type, function() {
  $(document).on(settings.coreEvents.updateIncomesSum.type, function(e) {
    console.log("update incomes sum");
    updateIncomesSum();
    updateGeneralSum();
  });

  $(document).on(settings.coreEvents.updateOutcomesSum.type, function(e) {
    console.log("update outcomes sum");
    updateOutcomesSum();
    updateGeneralSum();
  });
});

function updateIncomesSum() {
  var enrollments = settings.getCurrentEnrollments();
  console.log(enrollments);
  incomesSum = sumContainer(enrollments.incomes);
}

function updateOutcomesSum() {
  var enrollments = settings.getCurrentEnrollments();
  outcomesSum = sumContainer(enrollments.outcomes);
}

function sumContainer(container) {
  var sum = 0;
  $.each(container, function(key, enrollment) { sum += enrollment.value; });
  console.log(sum);
  return sum;
}

function updateGeneralSum() {
  console.log(incomesSum - outcomesSum);
  viewEvents.drawSums.incomesSum = incomesSum;
  viewEvents.drawSums.outcomesSum = outcomesSum;
  viewEvents.drawSums.generalSum = incomesSum - outcomesSum;
  $(document).trigger(viewEvents.drawSums);
}
