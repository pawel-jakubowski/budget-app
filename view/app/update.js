var coreEvents = appRequire('core/events.js');
var viewEvents = appRequire('view/events.js');
var restart = appRequire('core/app/restart.js');
var trayId = "#notification-tray";
var updateProgressBarIdName = "update-progress-bar";
var updateProgressBarId = "#" + updateProgressBarIdName;

$(document).on(coreEvents.appUpdateAvailable.type, function(e) {
  var dialog = require('remote').require('dialog');
  var response = dialog.showMessageBox({
    type: "info",
    buttons: ["Aktualizuj", "Nie teraz"],
    title: "Wykryto nową wersję programu",
    message: "Dostępna jest nowa wersja programu. Czy chcesz wykonać aktualizację?",
    detail: "Dostępna jest wersja: " + e.newVersion + "\n" +
      "Twoja wersja: " + e.currentVersion
  });
  console.log("User choice: " + response);
  if (response == 0) {
    addProgressBar();
    $(document).trigger(coreEvents.appUpdateStart);
  }
});

function addProgressBar() {
  var progressBar = $(
      '<div class="progress">' +
        '<div id="' + updateProgressBarIdName + '" class="progress-bar progress-bar-success" ' +
        'role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ' +
        'style="width:0%">' +
          '0% Aktualizacja w toku...' +
        '</div>' +
      '</div>'
    );
  progressBar.appendTo($(trayId));
}

$(document).on(coreEvents.appUpdateCompleted.type, function() {
  removeProgressBar();
  console.log("Update completed!");
  var updateCompleteNotification = $(
    '<div class="alert alert-success" role="alert">' +
      'Aktualizacja zakończona pomyślnie!' +
      '<div class="pull-right">' +
        '<button class="reload-page-btn btn btn-md btn-success">Odśwież aplikację</button>' +
      '</div>' +
    '</div>'
  );
  updateCompleteNotification.appendTo($(trayId));
});

function removeProgressBar() {
  $(trayId + " " + updateProgressBarId).parents('.progress').remove();
}

$(document).on(viewEvents.appUpdateProgress.type, function(e) {
  console.log("Update: " + e.value);
  var newValue = e.value <= 100 ? e.value : 100;
  $(trayId + " " + updateProgressBarId).width(newValue + "%");
  $(trayId + " " + updateProgressBarId).text(newValue + '% Aktualizacja w toku...');
});

$(document).on('click', '.reload-page-btn', function(){
  restart.restart();
});
