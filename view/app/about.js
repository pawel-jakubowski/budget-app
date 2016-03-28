var remote = require('remote');
var dialog = appRequire("utils/scripts/dialog.js");
var tools = require("./tools.js");

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
    tools.getMdlListItemTwoLine(appInfo.name, "Nazwa") +
    tools.getMdlListItemTwoLine(appInfo.version, "Wersja") +
    tools.getMdlListItemTwoLine(appInfo.author, "Autor");
  $(aboutDialogContent).html(content);
}

function fillToolsDialog() {
  var content = "";
  $.each(appInfo.contributions, function(index, tool) {
    content += tools.getMdlListItem(tool.name);
  });
  $(toolsDialogContent).html(content);
}
