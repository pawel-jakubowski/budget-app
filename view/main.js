require("./app/update.js");
var account = require("./account.js");

module.exports = {
  getAccount: getAccount
}

function getAccount() {
  return account;
};
