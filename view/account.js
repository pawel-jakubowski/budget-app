var enrollments = require("./enrollment.js");
var enrollmentForm = require("./enrollment/form.js");
var viewEvents = require("./events.js");
var accountNameId = "#account-name";
var settings = {};

module.exports = {
  init: init,
  setName: setName,
  enrollments: enrollments
};

function init(newSettings) {
  settings = newSettings;
  var data = settings.getAccount();
  var currentEnrollments = settings.getCurrentEnrollments();
  console.log("current enrollments");
  console.log(currentEnrollments);

  setName(data.name);
  enrollmentForm.setCurrency(data.currency);
  enrollments.setCurrency(data.currency);
  enrollments.init(currentEnrollments);
  // enrollmentForm.setAccountView(module.exports);
};

function setName(name) {
  $(accountNameId).text(name);
};
