var deleterClass = "delete";
var deleteButton = '<button class="' + deleterClass + '" type="button">X</button>';
// var moveUpButton = '<button class="up" type="button">Up</button>';
// var moveDownButton = '<button class="down" type="button">Down</button>';
// var dragArrow = '<span class="ui-icon ui-icon-arrowthick-2-n-s">';

module.exports = {
  deleterClass: "." + deleterClass,
  getString: getString
}

function getString() {
  return deleteButton;
};
