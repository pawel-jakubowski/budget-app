var buttonClass = 'btn btn-xs';
var deleterClass = "delete";
var pinClass = "checkbox-pin-btn";
var deleteButton =
  '<button class="' + deleterClass + ' ' + buttonClass + ' btn-danger pull-right" type="button">X</button>';
var pinButton =
  '<label class="' + pinClass + ' ' + buttonClass + ' btn-default">' +
    '<input type="checkbox" autocomplete="off">' +
    '<img class="icon" src="utils/img/icons/glyphicons-336-pushpin.png" />' +
  '</label>';

module.exports = {
  deleterClass: "." + deleterClass,
  pinClass: "." + pinClass,
  deleteButton: deleteButton,
  pinButton: pinButton
}
