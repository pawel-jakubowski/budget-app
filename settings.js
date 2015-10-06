var fs = require("fs");
var events = {
  settingsLoaded: jQuery.Event("settings-loaded")
};
var account = {};
var settingsFile = __dirname+"/settings/account.json";

$.getJSON(settingsFile).then(function(data) {
  console.log(data);
  account = data;
  $(document).trigger(events.settingsLoaded);
});

module.exports = {
  settingsEvents: events,
  coreEvents: require("./core/events.js"),
  viewEvents: require("./view/events.js"),
  getAccount: getAccount,
  saveAccount: saveAccount
}

function getAccount() {
  return account;
};

function saveAccount(newAccount) {
  var strJson = JSON.stringify(newAccount, null, 4);
  fs.writeFileSync(settingsFile, strJson);
  account = newAccount;
}
