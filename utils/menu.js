var remote = require('remote');

var menuAbout = "#hdrbtn-info";
var menuDebug = "#hdrbtn-debug";
var menuAboutTools = "#hdrbtn-tools";

var aboutDialog = "#appInfoDialog";


$(document).ready(function() {
  var dialog = document.querySelector(aboutDialog);
  $(menuAbout).click(function() {
    dialog.showModal();
  });
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });

  $(menuDebug).click(function() {
      remote.getCurrentWindow().toggleDevTools();
  });
});


var Menu = remote.require('menu');
var template = [
  {
    label: 'Konta',
    submenu: [
      {
        label: 'Dodaj',
        enabled: false
      },
      {
        label: 'Usuń',
        enabled: false
      },
      {
        label: 'Edytuj',
        enabled: false
      }
    ]
  },
  {
    label: 'Narzędzia',
    submenu: [
      {
        label: 'Narzędzia programisty',
        accelerator: 'Ctrl+Shift+I',
        click: function() { remote.getCurrentWindow().toggleDevTools(); }
      }
    ]
  },
  {
    label: 'Pomoc',
    submenu: [
      {
        label: 'O aplikacji',
        click: function() { about(); }
      }
    ]
  }
];

menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

var appInfoFile = "package.json";
var appInfo = {};
$.getJSON(appRootDir + '/' + appInfoFile).then(function(data) {
  console.log("App data:");
  console.log(data);
  appInfo = data;
});

function about()
{
  var dialog = remote.require('dialog');
  var response = dialog.showMessageBox({
    type: "info",
    buttons: ["Ok"],
    title: "Pomoc",
    message:
      "Nazwa programu: \t" + appInfo.name + "\n" +
      "Wersja programu: \t" + appInfo.version + "\n" +
      "Autor: \t\t\t\t" + appInfo.author + "\n",
    detail:
      "Używane narzędzia:\n" + appInfo.contributions
  });
}
