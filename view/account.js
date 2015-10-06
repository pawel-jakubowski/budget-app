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

  setName(data.name);
  enrollments.init(data);
  enrollmentForm.setAccountView(module.exports);
};

function setName(name) {
  $(accountNameId).text(name);
};
