var settings = appRequire("settings.js");
var coreEvents = appRequire("core/events.js");
var drawer = require("./enrollment/draw.js");

$(document).on(settings.settingsEvents.settingsLoaded.type, function() {
  /* Navbar */
  $("#addEntityLink").click(function(e) {
    $(this).parent("li").toggleClass("active");
    $("#addEnrollmentForm").toggle("slide");
  });

  /* Datepicker */
  $.fn.datepicker.dates['pl'] = {
    days:["niedziela","poniedziałek","wtorek","środa","czwartek","piątek","sobota"],
    daysShort:["niedz.","pon.","wt.","śr.","czw.","piąt.","sob."],
    daysMin:["ndz.","pn.","wt.","śr.","czw.","pt.","sob."],
    months:["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień"],
    monthsShort:["sty.","lut.","mar.","kwi.","maj","cze.","lip.","sie.","wrz.","paź.","lis.","gru."],
    today:"dzisiaj",
    weekStart:1,
    clear:"wyczyść",
    format:"dd.mm.yyyy"
  };

  $('#monthpicker').datepicker({
    format: "mm.yyyy",
    weekStart: 1,
    viewMode: "months",
    minViewMode: "months",
    language: "pl"
  });

  $('#monthpicker').change(function(){
    var newDate = $(this).val();
    settings.setCurrentDate(newDate);
    var monthEnrollments = settings.getCurrentEnrollments();
    drawer.printFromData(monthEnrollments);
    $(document).trigger(coreEvents.updateIncomesSum);
    $(document).trigger(coreEvents.updateOutcomesSum);
  })

  $('#monthpicker').datepicker('update', new Date());
});
