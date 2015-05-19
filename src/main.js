
var container;

var columnClass,
    columnCount;

var yIndices = [];

var $items = [];

var initialized = false;



function append(items) {
  var t1 = Date.now();

  var heights = getItemHeights(items),
      columns = [];

  for (var i = 0; i < columnCount; i++) {
    columns.push(document.createDocumentFragment());
  }

  var count = items.length,
      index,
      item;

  updateYIndices();

  for (var j = 0; j < count; j++) {
    index = getColumnIndex();
    item = items[j];

    yIndices[index] += heights[j] + 20;
    columns[index].appendChild(item);
  }

  for (var k = 0; k < columnCount; k++) {
    container.children[k].appendChild(columns[k]);
  }

  $items = $items.concat(items);

  var t2 = Date.now();
  console.log(t1, ':', t2, ':', t2 - t1);
}


function prepend(items) {
  var t1 = Date.now();

  var heights1 = getItemHeights(items);
  var heights2 = getExistingItemHeights();
  var heights = heights1.concat(heights2);
  items = items.concat($items);

  resetYIndices();
  removeColumns();

  var columns = createColumns(columnCount),
      count = items.length,
      index,
      item;

  for (var i = 0; i < count; i++) {
    index = getColumnIndex();
    item = items[i];

    yIndices[index] += heights[i] + 20;
    columns.childNodes[index].appendChild(item);
  }

  container.appendChild(columns);

  $items = items;

  var t2 = Date.now();
  console.log(t1, ':', t2, ':', t2 - t1);
}


function removeItem(item) {
  $items.splice($items.indexOf(item), 1);
  update();
}


function update(numColumns) {
  var t1 = Date.now();

  var heights = getExistingItemHeights();

  resetYIndices();
  removeColumns();

  if (numColumns) {
    columnCount = numColumns;
  }

  var columns = createColumns(columnCount),
      count = $items.length,
      index,
      item;

  for (var i = 0; i < count; i++) {
    index = getColumnIndex();
    item = $items[i];

    yIndices[index] += heights[i] + 20;
    columns.childNodes[index].appendChild(item);
  }

  container.appendChild(columns);

  var t2 = Date.now();
  console.log(t1, ':', t2, ':', t2 - t1);
}



function createColumns(count) {
  var columns = document.createDocumentFragment(),
      column;

  for (var i = 0; i < count; i++) {
    column = document.createElement('div');
    column.className = columnClass;
    columns.appendChild(column);
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


function resetYIndices() {
  yIndices.length = 0;

  for (var i = 0; i < columnCount; i++) {
    yIndices.push(0);
  }
}


function updateYIndices() {
  var columns = container.children;

  if (columns.length) {
    yIndices.length = 0;

    for (var i = 0; i < columnCount; i++) {
      yIndices.push(columns[i].offsetHeight);
    }
  }
}


function getItemHeights(items) {
  var temp = document.createElement('div');
  temp.className = columnClass;
  temp.style.position = 'absolute';
  temp.style.left = '-10000px';
  temp.style.top = '-10000px';
  //temp.style.width = container.offsetWidth / columnCount + 'px';

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


function getExistingItemHeights() {
  var heights = [];
  for (var i = 0, l = $items.length; i < l; i++) {
    heights.push($items[i].offsetHeight);
  }
  return heights;
}


function bindToMediaQueryEvents(options) {
  var handleMediaQueryChange = function(mql) {
    if (mql.matches) {
      columnCount = options.columns;
      if (initialized) {
        update(columnCount);
      }
    }
  };

  var mql = window.matchMedia(options.query);
  mql.addListener(handleMediaQueryChange);
  handleMediaQueryChange(mql);
}


function init(options) {
  columnClass = options.columnClass;

  container = document.querySelector(options.containerSelector);
  columnCount = options.columnCount;

  if (options.mediaQueries && window.matchMedia) {
    for (var i = 0, l = options.mediaQueries.length; i < l; i++) {
      bindToMediaQueryEvents(options.mediaQueries[i]);
    }
  }

  var items = container.querySelectorAll(options.itemSelector);

  for (var n = 0, m = items.length; n < m; n++) {
    $items.push(items[n]);
  }

  update();
  initialized = true;
}

