var coreEvents = appRequire('core/events.js');
var restart = appRequire('core/app/restart.js');
var trayId = "#notification-tray";

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
  if (response == 0)
    $(document).trigger(coreEvents.appUpdateStart);
});

$(document).on(coreEvents.appUpdateCompleted.type, function() {
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

$(document).on('click', '.reload-page-btn', function(){
  restart.restart();
});
