module.exports = {
  getMdlListItem: getMdlListItem,
  getMdlListItemTwoLine: getMdlListItemTwoLine
}

function getMdlListItem(title) {
  var item =
    '<li class="mdl-list__item">' +
      '<span class="mdl-list__item-primary-content">' +
        '<span>'+ title + '</span>' +
      '</span>' +
    '</li>';
  return item;
}

function getMdlListItemTwoLine(title, subtitle) {
  var item =
    '<li class="mdl-list__item mdl-list__item--two-line">' +
      '<span class="mdl-list__item-primary-content">' +
        '<span>'+ title + '</span>' +
        '<span class="mdl-list__item-sub-title">' + subtitle + '</span>' +
      '</span>' +
    '</li>';
  return item;
}
