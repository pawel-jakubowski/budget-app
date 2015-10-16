module.exports = {
  addIncome: jQuery.Event("add-income"),
  addOutcome: jQuery.Event("add-outcome"),
  addValidIncome: jQuery.Event("add-valid-income"),
  addValidOutcome: jQuery.Event("add-valid-outcome"),
  deleteIncome: jQuery.Event("delete-income"),
  deleteOutcome: jQuery.Event("delete-outcome"),
  moveIncomes: jQuery.Event("move-incomes"),
  moveOutcomes: jQuery.Event("move-outcomes"),
  drawSums: jQuery.Event("draw-sums"),
  invalidEnrollment: jQuery.Event("invalid-enrollment"),
  appUpdateProgress: jQuery.Event("app-update-progress")
}
