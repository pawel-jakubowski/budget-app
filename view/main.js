require("./app/update.js");
require("./controls.js");
var account = require("./account.js");

module.exports = {
  getAccount: getAccount
}

function getAccount() {
  return account;
};
