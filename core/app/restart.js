module.exports = {
  restart: restart
}

function restart() {
  console.log("Restart app!");
  var BrowserWindow = require("remote").require('browser-window');
  $.each(BrowserWindow.getAllWindows(), function(index, window) {
    window.reload();
  });
}
