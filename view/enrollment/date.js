var settings = appRequire("settings.js");
var dialog = appRequire("utils/scripts/dialog.js")
var moment = appRequire("utils/modules/moment-with-locales.js");
var drawer = require("./draw.js");
var tools = require("./tools.js");
moment.locale('pl');

var dateLabelId = "#date";
var dateFilter = "#date-filter";
var dateDialog = "#dateDialog";
var yearId = "#filter-year";
var monthId = "input:radio[name=filter-month]";
var saveId = "#changeDate";

$(document).ready(function() {
  updateDate(settings.getCurrentDate());
  dialog.bindDialog(dateDialog, dateFilter);

  $(dateFilter).click(function() {
    var currentDate = moment(settings.getCurrentDate());
    $(yearId).attr("value", currentDate.format("YYYY"));
    $(monthId + "[value=" + currentDate.format("M") + "]").click();
    var enterKey = 13;
    tools.bindKeys([enterKey], [saveId]);
  });;

  $(saveId).click(function() {
    filterByDate(getMonth(), getYear());
    tools.unbindKeys();
  });
})

function updateDate(date) {
  var currentDate = moment(date);
  $(dateLabelId).text(currentDate.format("MMMM YYYY"));
}

function filterByDate(month, year) {
  var date = moment(month + "-" + year, "M-YYYY").toDate();
  updateDate(date);
  var newDate = moment(date).toDate();
  settings.setCurrentDate(newDate);
  var monthEnrollments = settings.getCurrentEnrollments();
  drawer.printFromData(monthEnrollments);
}

function getYear() {
  return $(dateDialog).find(yearId).val();
}

function getMonth() {
  return $(dateDialog).find(monthId + ":checked").val();
}
