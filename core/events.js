module.exports = {
  viewReady: jQuery.Event("view-ready"),
  updateIncomesSum: jQuery.Event("update-incomes-sum"),
  updateOutcomesSum: jQuery.Event("update-outcomes-sum"),
  appInfoReady:  jQuery.Event("app-info-ready"),
  appUpdateReady: jQuery.Event("app-update-ready"),
  appUpdateCompleted: jQuery.Event("app-update-complited")
}
