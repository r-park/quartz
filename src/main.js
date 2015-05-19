'use strict';


var container;

var columnClass,
    columnCount;

var yIndices = [];

var $items = [];

var initialized = false;



function append(items) {
  var columns = createColumnFragments(),
      heights = getItemHeights(items);

  refreshYIndices();
  distributeItemsToColumns(items, columns, heights);

  for (var i = 0; i < columnCount; i++) {
    container.children[i].appendChild(columns[i]);
  }

  $items = $items.concat(items);
}


function prepend(items) {
  var columns  = createColumns(),
      heights1 = getItemHeights(items),
      heights2 = getExistingItemHeights(),
      heights  = heights1.concat(heights2);

  items = items.concat($items);

  resetYIndices();
  removeColumns();
  distributeItemsToColumns(items, columns.childNodes, heights);
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

  var columns = createColumns(),
      heights = getExistingItemHeights();

  resetYIndices();
  removeColumns();
  distributeItemsToColumns($items, columns.childNodes, heights);
  container.appendChild(columns);
}


function distributeItemsToColumns(items, columns, heights) {
  var count = items.length,
      columnIndex,
      item;

  for (var i = 0; i < count; i++) {
    columnIndex = getColumnIndex();
    item = items[i];
    yIndices[columnIndex] += heights[i] + 20;
    columns[columnIndex].appendChild(item);
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


function getColumnIndex() {
  var min = Math.min.apply(Math, yIndices);
  return yIndices.indexOf(min);
}


function getExistingItemHeights() {
  var heights = [];

  for (var i = 0, l = $items.length; i < l; i++) {
    heights.push($items[i].offsetHeight);
  }

  return heights;
}


function getItemHeights(items) {
  var temp = document.createElement('div');
  temp.className = columnClass;
  temp.style.position = 'absolute';
  temp.style.left = '-10000px';
  temp.style.top = '-10000px';
  temp.style.width = container.offsetWidth / columnCount + 'px';

  var heights = [],
      i = 0,
      l = items.length;

  for (i; i < l; i++) {
    temp.appendChild(items[i]);
  }

  container.appendChild(temp);

  for (i = 0; i < l; i++) {
    heights.push(items[i].offsetHeight);
  }

  container.removeChild(temp);

  return heights;
}


function refreshYIndices() {
  var columns = container.children,
      count = columns.length;

  if (count) {
    yIndices.length = 0;

    for (var i = 0; i < count; i++) {
      yIndices.push(columns[i].offsetHeight);
    }
  }
}


function resetYIndices() {
  yIndices.length = 0;

  var count = columnCount;
  while (count--) {
    yIndices.push(0);
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
