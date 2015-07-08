'use strict';


var $window = window,
    $document = document;

var isArray = Array.isArray;


/**
 * @name Quartz
 * @constructor
 *
 * @param {{}} config
 * @param {string} config.columnClass
 * @param {number} [config.columnCount]
 * @param {Element|string} config.container
 * @param {Element|Element[]|jQuery|NodeList|string} config.items
 * @param {Array} [config.mediaQueries]
 *
 */
function Quartz(config) {
  this.columnClass = config.columnClass;
  this.columnCount = config.columnCount;
  this.yIndices = [];

  if (typeof config.container === 'string') {
    this.container = $document.querySelector(config.container);
  }
  else {
    this.container = config.container;
  }

  if (typeof config.items === 'string') {
    this.items = this.toArray($document.querySelectorAll(config.items));
  }
  else {
    this.items = this.toArray(config.items);
  }

  // if `config.mediaQueries` is not defined, assume static
  // non-responsive layout and skip MediaQueryList binding step.
  if (config.mediaQueries && $window.matchMedia) {
    this.bindMediaQueries(config.mediaQueries);
  }
  else {
    this.update();
  }

  this.initialized = true;
}


Quartz.prototype = {

  /*=================================================================
    Public API
  =================================================================*/

  /**
   * @param {Element|Element[]|NodeList} items
   */
  append : function(items) {
    if (typeof items.length === 'undefined') {
      items = [items];
    }

    var columnCount = this.columnCount,
        columns     = this.createColumnFragments(),
        container   = this.container,
        heights     = this.getItemHeights(items),
        liveColumns = container.children;

    this.refreshYIndices();
    this.distributeItemsToColumns(columns, items, heights);

    for (var i = 0; i < columnCount; i++) {
      liveColumns[i].appendChild(columns[i]);
    }

    this.items = this.items.concat(this.toArray(items));
  },


  /**
   * @param {Element|Element[]|NodeList} items
   */
  prepend : function(items) {
    items = this.toArray(items);

    var columns  = this.createColumns(),
        heights1 = this.getItemHeights(items),
        heights2 = this.getExistingItemHeights(),
        heights  = heights1.concat(heights2);

    items = items.concat(this.items);

    this.resetYIndices();
    this.clearContainer();
    this.distributeItemsToColumns(columns.childNodes, items, heights);
    this.container.appendChild(columns);
    this.items = items;
  },


  /**
   * @param {Element|Element[]|NodeList} items
   */
  remove : function(items) {
    if (typeof items.length === 'undefined') {
      items = [items];
    }

    var _items = this.items,
        i = items.length,
        index;

    while (i--) {
      index = _items.indexOf(items[i]);
      if (index !== -1) {
        _items.splice(index, 1);
      }
    }

    this.update();
  },


  /**
   *
   */
  removeAll : function() {
    this.items.length = 0;
    this.update();
  },


  /**
   * @param {number} [numColumns]
   */
  update : function(numColumns) {
    if (numColumns) this.columnCount = numColumns;

    var columns = this.createColumns(),
        items = this.items,
        heights;

    this.resetYIndices();

    if (items.length) {
      heights = this.initialized ? this.getExistingItemHeights() : this.getItemHeights(items);
      this.clearContainer();
      this.distributeItemsToColumns(columns.childNodes, items, heights);
    }
    else {
      this.clearContainer();
    }

    this.container.appendChild(columns);
  },



  /*=================================================================
    Internal
  =================================================================*/

  /**
   *
   */
  clearContainer : function() {
    var container = this.container;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  },


  /**
   * @returns {DocumentFragment[]}
   */
  createColumnFragments : function() {
    var fragments = [],
        count = this.columnCount;

    while (count--) {
      fragments.push($document.createDocumentFragment());
    }

    return fragments;
  },


  /**
   * @returns {DocumentFragment} with <div> child nodes
   */
  createColumns : function() {
    var count = this.columnCount,
        columnClass = this.columnClass,
        columns = $document.createDocumentFragment(),
        column;

    while (count--) {
      column = $document.createElement('div');
      column.className = columnClass;
      columns.appendChild(column);
    }

    return columns;
  },


  /**
   * @returns {Element}
   */
  createTestColumn : function() {
    var liveColumn = this.container.firstChild,
        testColumn = $document.createElement('div');

    testColumn.className = this.columnClass;
    testColumn.style.position = 'absolute';
    testColumn.style.left = '-10000px';
    testColumn.style.top = '-10000px';

    if (liveColumn && liveColumn.className === this.columnClass) {
      testColumn.style.width = $window.getComputedStyle(liveColumn).width;
    }
    else {
      testColumn.style.width = this.container.offsetWidth / this.columnCount + 'px';
    }

    return testColumn;
  },


  /**
   * @param {DocumentFragment[]|NodeList} columns
   * @param {Element[]|NodeList} items
   * @param {number[]} heights
   */
  distributeItemsToColumns : function(columns, items, heights) {
    var count = items.length,
        yIndices = this.yIndices,
        columnIndex;

    for (var i = 0; i < count; i++) {
      columnIndex = this.getColumnIndex();
      yIndices[columnIndex] += heights[i];
      columns[columnIndex].appendChild(items[i]);
    }
  },


  /**
   * @returns {number}
   */
  getColumnIndex : function() {
    var min = Math.min.apply(Math, this.yIndices);
    return this.yIndices.indexOf(min);
  },


  /**
   * @returns {number[]}
   */
  getExistingItemHeights : function() {
    var items = this.items,
        heights = [];

    if (items.length) {
      var style = $window.getComputedStyle(items[0]),
          marginBottom = parseInt(style.marginBottom, 10);

      for (var i = 0, l = items.length; i < l; i++) {
        heights.push(items[i].offsetHeight + marginBottom);
      }
    }

    return heights;
  },


  /**
   * @param {Element[]|NodeList} items
   * @returns {number[]}
   */
  getItemHeights : function(items) {
    var testColumn = this.createTestColumn(),
        heights = [],
        i = 0,
        l = items.length;

    for (i; i < l; i++) {
      testColumn.appendChild(items[i]);
    }

    this.container.appendChild(testColumn);

    var style = $window.getComputedStyle(items[0]),
        marginBottom = parseInt(style.marginBottom, 10);

    for (i = 0; i < l; i++) {
      heights.push(items[i].offsetHeight + marginBottom);
    }

    this.container.removeChild(testColumn);

    return heights;
  },


  /**
   *
   */
  refreshYIndices : function() {
    var columns = this.container.children,
        count = columns.length,
        yIndices = this.yIndices;

    if (count) {
      yIndices.length = 0;

      for (var i = 0; i < count; i++) {
        yIndices.push(columns[i].offsetHeight);
      }
    }
  },


  /**
   * @returns {number[]}
   */
  resetYIndices : function() {
    var count = this.columnCount,
        yIndices = this.yIndices;

    yIndices.length = 0;

    while (count--) {
      yIndices.push(0);
    }
  },


  /**
   * @param {Element|Element[]|NodeList} object
   * @returns {Element[]}
   */
  toArray : function(object) {
    if (isArray(object)) return object;

    var i = object.length;

    if (typeof i === 'number') {
      var a = new Array(i);
      while (i--) { a[i] = object[i]; }
      return a;
    }

    return [object];
  },


  /**
   * @param {{query:string, columns:number}[]} mediaQueries
   */
  bindMediaQueries : function(mediaQueries) {
    var matched = false,
        config,
        mediaQueryList,
        mqlListener;

    for (var i = 0, l = mediaQueries.length; i < l; i++) {
      config = mediaQueries[i];
      mediaQueryList = $window.matchMedia(config.query);
      mqlListener = this.bindToMediaQueryList(mediaQueryList, config, this);

      if (!matched && mediaQueryList.matches) {
        matched = true;
        mqlListener(mediaQueryList);
      }
    }
  },


  /**
   * @param {MediaQueryList} mediaQueryList
   * @param {{query:string, columns:number}} config
   * @param {Quartz} quartz
   * @returns {Function}
   */
  bindToMediaQueryList : function(mediaQueryList, config, quartz) {
    var mqlListener = function(mql) {
      if (mql.matches) {
        quartz.update(config.columns);
      }
    };

    mediaQueryList.addListener(mqlListener);
    return mqlListener;
  }

};
