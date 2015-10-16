var coreEvents = appRequire('core/events.js');

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
