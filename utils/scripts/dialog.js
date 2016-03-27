module.exports = {
  bindDialog: bindDialog
}

function bindDialog(dialogSelector, dialogButton) {
  var dialog = document.querySelector(dialogSelector);
  $(dialogButton).click(function() {
    dialog.showModal();
  });
  $(dialogSelector + ' .close').click(function() {
    dialog.close();
  });
}
