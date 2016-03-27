global.appRootDir = __dirname;
// Allow to call local require function
global.appRequire = function(name) {
    return require(appRootDir + '/' + name);
}

appRequire("utils/scripts/jquery.js");
appRequire("utils/scripts/menu.js");
var settings = appRequire("settings.js");
var enrollments = appRequire("core/enrollment.js");
var view = appRequire("view/main.js");
var coreEvents = settings.coreEvents;

$(document).on(settings.settingsEvents.settingsLoaded.type, function() {
  appRequire("core/app/update.js").updateApplication();
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
