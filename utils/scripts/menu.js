var remote = require('remote');
var dialog = appRequire("utils/scripts/dialog.js")

var menuAbout = "#hdrbtn-info";
var menuDebug = "#hdrbtn-debug";
var menuAboutTools = "#hdrbtn-tools";

var aboutDialog = "#appInfoDialog";
var aboutDialogContent = aboutDialog + " .mdl-dialog__content .mdl-list";

var toolsDialog = "#appToolsDialog";
var toolsDialogContent = toolsDialog + " .mdl-dialog__content .mdl-list";

var appInfoFile = "package.json";
var appInfo = {};

$.getJSON(appRootDir + '/' + appInfoFile).then(function(data) {
  console.log("App data:");
  console.log(data);
  appInfo = data;
  fillAboutDialog();
  fillToolsDialog();
});

$(document).ready(function() {
  dialog.bindDialog(aboutDialog, menuAbout);
  dialog.bindDialog(toolsDialog, menuAboutTools);

  $(menuDebug).click(function() {
      remote.getCurrentWindow().toggleDevTools();
  });
});

function fillAboutDialog() {
  var content =
    getMdlListItemTwoLine(appInfo.name, "Nazwa") +
    getMdlListItemTwoLine(appInfo.version, "Wersja") +
    getMdlListItemTwoLine(appInfo.author, "Autor");
  $(aboutDialogContent).html(content);
}

function fillToolsDialog() {
  var content = "";
  $.each(appInfo.contributions, function(index, tool) {
    content += getMdlListItem(tool.name);
  });
  $(toolsDialogContent).html(content);
}

function getMdlListItem(title) {
  var item =
    '<li class="mdl-list__item">' +
      '<span class="mdl-list__item-primary-content">' +
        '<span>'+ title + '</span>' +
      '</span>' +
    '</li>';
  return item;
}

function getMdlListItemTwoLine(title, subtitle) {
  var item =
    '<li class="mdl-list__item mdl-list__item--two-line">' +
      '<span class="mdl-list__item-primary-content">' +
        '<span>'+ title + '</span>' +
        '<span class="mdl-list__item-sub-title">' + subtitle + '</span>' +
      '</span>' +
    '</li>';
  return item;
}
