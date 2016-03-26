module.exports = {
  /* Add */
  addIncome: jQuery.Event("add-income"),
  addOutcome: jQuery.Event("add-outcome"),
  addValidIncome: jQuery.Event("add-valid-income"),
  addValidOutcome: jQuery.Event("add-valid-outcome"),
  /* Pin */
  pinIncome: jQuery.Event("pin-income"),
  pinOutcome: jQuery.Event("pin-outcome"),
  /* Delete */
  deleteIncome: jQuery.Event("delete-income"),
  deleteOutcome: jQuery.Event("delete-outcome"),
  /* Edit */
  editIncome: jQuery.Event("edit-income"),
  editOutcome: jQuery.Event("edit-outcome"),
  /* Move */
  moveIncomes: jQuery.Event("move-incomes"),
  moveOutcomes: jQuery.Event("move-outcomes"),
  /* Draw */
  drawSums: jQuery.Event("draw-sums"),
  /* Invalid */
  invalidEnrollment: jQuery.Event("invalid-enrollment"),
  /* Update */
  appUpdateProgress: jQuery.Event("app-update-progress")
}
