var coreEvents = appRequire('core/events.js');
var viewEvents = appRequire('view/events.js');
var restart = appRequire('core/app/restart.js');
var coreUpdate = appRequire('core/app/update.js');
var tools = require('./tools.js');

var updateProgressBarIdName = "update-progress-bar";
var updateProgressBarId = "#" + updateProgressBarIdName;
var updateBadgeId = "#update-flag";
var checkUpdateButton = "#check-update";
var updateAppButton = "#update-app";
var checkUpdateSpin = "#check-update-spin";
var versionInfoId = "#update-vesion-info";

$(document).ready(function() {
  $(checkUpdateButton).click(function() {
    $(checkUpdateSpin).addClass("is-active");
    $(checkUpdateButton).attr("disabled", true);
    coreUpdate.updateApplication();
  });

  $(updateAppButton).click(function() {
    addProgressBar();
    $(checkUpdateSpin).addClass("is-active");
    $(updateAppButton).attr("disabled", true);
    $(document).trigger(coreEvents.appUpdateStart);
  });

  $(document).on(viewEvents.appUpdateProgress.type, function(e) {
    console.log("Update: " + e.value);
    var newValue = e.value <= 100 ? e.value : 100;
    document.querySelector(updateProgressBarId).addEventListener('mdl-componentupgraded', function() {
      this.MaterialProgress.setProgress(newValue);
    });
  });
});

$(document).on(coreEvents.appInfoReady.type, function(e) {
  var currentVersionHtml = tools.getMdlListItemTwoLine(e.info.version, "Posiadana wersja");
  $(versionInfoId).empty();
  $(versionInfoId).append(currentVersionHtml);
});

$(document).on(coreEvents.appUpdateInfo.type, function(e) {
  if (e.updateNeeded) {
    $(updateBadgeId).attr("data-badge" ,"!");
    $(checkUpdateButton).addClass("hidden");
    $(updateAppButton).removeClass("hidden");
  }

  var currentVersionHtml = tools.getMdlListItemTwoLine(e.currentVersion, "Posiadana wersja");
  var availableVersionHtml = tools.getMdlListItemTwoLine(e.newVersion, "Dostepna wersja");
  $(versionInfoId).empty();
  $(versionInfoId).append(currentVersionHtml);
  $(versionInfoId).append(availableVersionHtml);

  $(checkUpdateButton).attr("disabled", false);
  $(checkUpdateSpin).removeClass("is-active");
});

function addProgressBar() {
  $(updateProgressBarId).removeClass("hidden");
}

$(document).on(coreEvents.appUpdateCompleted.type, function() {
  removeProgressBar();
  console.log("Update completed!");
  notifyAboutUpdate();
});

function removeProgressBar() {
  $(updateProgressBarId).addClass("hidden");
}

function notifyAboutUpdate() {

}


$(document).on('click', '.reload-page-btn', function(){
  restart.restart();
});
