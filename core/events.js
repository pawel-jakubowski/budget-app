module.exports = {
  viewReady: jQuery.Event("view-ready"),
  updateIncomesSum: jQuery.Event("update-incomes-sum"),
  updateOutcomesSum: jQuery.Event("update-outcomes-sum"),
  appInfoReady:  jQuery.Event("app-info-ready"),
  appUpdateStart: jQuery.Event("app-update-start"),
  appUpdateCompleted: jQuery.Event("app-update-complited")
}
