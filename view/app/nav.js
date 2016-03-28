var budgetContentClass = ".budget-content";
var updateContentClass = ".update-content";
var otherContentClass = ".change-content";
var defaultHiddenClass = ".content-default-hidden";

var budgetLinkId = "#budget-link";
var updateLinkId = "#update-link";

$(document).ready(function() {
  changePage(budgetLinkId, budgetContentClass);
  changePage(updateLinkId, updateContentClass);

  $(budgetLinkId).trigger("click");
});

function changePage(linkId, contentClass) {
  var otherContent = $(otherContentClass);

  $(linkId).click(function() {
    otherContent.not(contentClass).hide();
    $(contentClass).not(defaultHiddenClass).show();
  });
}
