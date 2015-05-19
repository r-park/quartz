'use strict';


var container;

var columnClass,
    columnCount;

var $items = [];

var initialized = false;



function append(items) {
  var columns = createColumnFragments(),
      index = $items.length % columnCount;

  distributeItemsToColumns(items, columns, index);

  for (var i = 0; i < columnCount; i++) {
    container.children[i].appendChild(columns[i]);
  }

  $items = $items.concat(items);
}


function prepend(items) {
  var columns = createColumns();

  items = items.concat($items);

  removeColumns();
  distributeItemsToColumns(items, columns.childNodes);
  container.appendChild(columns);

  $items = items;
}


function removeItem(items) {
  var i = items.length;

  while (i--) {
    $items.splice($items.indexOf(items[i]), 1);
  }

  update();
}


function update(numColumns) {
  if (numColumns) columnCount = numColumns;

  var columns = createColumns();

  removeColumns();
  distributeItemsToColumns($items, columns.childNodes);
  container.appendChild(columns);
}


function distributeItemsToColumns(items, columns, startIndex) {
  var count = items.length,
      index = startIndex || 0,
      maxIndex = columnCount - 1;

  for (var i = 0; i < count; i++) {
    columns[index].appendChild(items[i]);

    if (index === maxIndex) {
      index = 0;
    }
    else {
      index++;
    }
  }
}


function createColumns(count) {
  var columns = document.createDocumentFragment(),
      column;

  count = count || columnCount;

  while (count--) {
    column = document.createElement('div');
    column.className = columnClass;
    columns.appendChild(column);
  }

  return columns;
}


function createColumnFragments(count) {
  var columns = [];

  count = count || columnCount;

  while (count--) {
    columns.push(document.createDocumentFragment());
  }

  return columns;
}


function removeColumns() {
  var column;
  while (column = container.firstChild) {
    container.removeChild(column);
  }
}


function bindToMediaQueryList(options) {
  var mqlListener = function(mql) {
    if (mql.matches) {
      columnCount = options.columns;
      if (initialized) update();
    }
  };

  var mql = window.matchMedia(options.query);
  mql.addListener(mqlListener);
  mqlListener(mql);
}


function init(options) {
  columnClass = options.columnClass;

  container = document.querySelector(options.containerSelector);
  columnCount = options.columnCount;

  if (options.mediaQueries && window.matchMedia) {
    var i = options.mediaQueries.length;
    while (i--) {
      bindToMediaQueryList(options.mediaQueries[i]);
    }
  }

  var items = container.querySelectorAll(options.itemSelector);
  for (var n = 0, m = items.length; n < m; n++) {
    $items.push(items[n]);
  }

  update();

  initialized = true;
}
