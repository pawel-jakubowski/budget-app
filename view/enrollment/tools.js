var buttonClass = 'btn btn-xs';
var deleterClass = "delete";
var pinClass = "checkbox-pin-btn";
var deleteButton =
  '<button class="' + deleterClass + ' ' + buttonClass + ' btn-danger pull-right" type="button">X</button>';
function pinButton(pinned) {
  var button =
    '<label class="' + pinClass + ' ' + buttonClass + (pinned ? ' active ': ' ') + 'btn-default">' +
      '<input type="checkbox" autocomplete="off" >' +
      '<img class="icon" src="utils/img/icons/glyphicons-336-pushpin.png" />' +
    '</label>';
  return button;
}

module.exports = {
  incomesId: "incomes",
  outcomesId: "outcomes",
  incomesSumId: "incomes-sum",
  outcomesSumId: "outcomes-sum",
  generalSumId: "general-sum",
  enrollmentClass: "enrollment",
  nameClass: "name",
  deleterClass: "." + deleterClass,
  pinClass: "." + pinClass,
  deleteButton: deleteButton,
  pinButton: pinButton
}
