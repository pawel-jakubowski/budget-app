module.exports = {
  restart: restart
}

function restart() {
  var app = require("remote").require('app');
  var exec = require('child_process').exec;
  console.log(process.execPath + " " + process.execArgv);
  exec(process.execPath + " " + process.execArgv);
  app.quit();
}
