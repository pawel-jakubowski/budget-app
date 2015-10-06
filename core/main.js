require("./utils/jquery.js");
var settings = require('./settings.js');
var enrollments = require("./core/enrollment.js");
var view = require("./view/main.js");
var coreEvents = settings.coreEvents;

$(document).on(settings.settingsEvents.settingsLoaded.type, function() {
  var accountData = settings.getAccount();
  var accountView = view.getAccount();

  console.log("You are running jQuery version: " + $.fn.jquery);
  console.log("Account object:");
  console.log(accountData);

  accountView.init(settings);
  $(document)
    .trigger(coreEvents.viewReady)
    .trigger(coreEvents.updateIncomesSum)
    .trigger(coreEvents.updateOutcomesSum);
});
