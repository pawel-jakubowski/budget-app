var tools = require("./enrollment/tools.js");
var drawer = require("./enrollment/draw.js");
var mover = require("./enrollment/move.js");
var deleter = require("./enrollment/delete.js");
var pinner = require("./enrollment/pin.js");
var editor = require("./enrollment/edit.js");
var sorter = require("./enrollment/sort.js");
var dater = require("./enrollment/date.js");

module.exports = {
  init: init,
  setCurrency: drawer.setCurrency,
}

function init(data) {
  drawer.printFromData(data);
  // mover.init();
}
