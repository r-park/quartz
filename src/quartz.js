'use strict';

var isArray = Array.isArray;
var slice = Array.prototype.slice;


/**
 * @name Quartz
 * @constructor
 *
 * @param {{}}     config
 * @param {string} config.columnClass
 * @param {number} config.columnCount
 * @param {string} config.containerSelector
 * @param {string} config.itemSelector
 * @param {Array}  config.mediaQueries
 */
function Quartz(config) {
  this.container = document.querySelector(config.containerSelector);

  this.columnClass = config.columnClass;

  this.columnCount = config.columnCount;

  /**
   * @type Array.<Element>
   */
  this.items = [];

  /**
   * @type Array.<number>
   */
  this.yIndices = [];


  var items = this.container.querySelectorAll(config.itemSelector);
  for (var n = 0, m = items.length; n < m; n++) {
    this.items.push(items[n]);
  }


  if (config.mediaQueries && window.matchMedia) {
    var i = config.mediaQueries.length;
    while (i--) {
      this.bindToMediaQueryList(config.mediaQueries[i]);
    }
  }


  this.update();

  this.initialized = true;
}


Quartz.prototype = {

  /**
   * TODO: NodeList to Array
   * @param {Array.<Element>|NodeList} items
   */
  append : function(items) {
    var container = this.container,
        columns = this.createColumnFragments(),
        columnCount = this.columnCount,
        heights = this.getItemHeights(items);

    this.refreshYIndices();
    this.distributeItemsToColumns(items, columns, heights);

    for (var i = 0; i < columnCount; i++) {
      container.children[i].appendChild(columns[i]);
    }

    this.items = this.items.concat(items);
  },


  /**
   * TODO: NodeList to Array
   * @param {Array.<Element>|NodeList} items
   */
  prepend : function(items) {
    var columns  = this.createColumns(),
        heights1 = this.getItemHeights(items),
        heights2 = this.getExistingItemHeights(),
        heights  = heights1.concat(heights2);

    items = items.concat(this.items);

    this.resetYIndices();
    this.removeColumns();
    this.distributeItemsToColumns(items, columns.childNodes, heights);
    this.container.appendChild(columns);

    this.items = items;
  },


  /**
   * @param {Array.<Element>|NodeList} items
   */
  remove : function(items) {
    var i = items.length;

    while (i--) {
      this.items.splice(this.items.indexOf(items[i]), 1);
    }

    this.update();
  },


  /**
   * @param {number} [numColumns]
   */
  update : function(numColumns) {
    if (numColumns) this.columnCount = numColumns;

    var columns = this.createColumns(),
        heights = this.getExistingItemHeights();

    this.resetYIndices();
    this.removeColumns();
    this.distributeItemsToColumns(this.items, columns.childNodes, heights);
    this.container.appendChild(columns);
  },


  /**
   * @param {Array.<Element>|NodeList} items
   * @param {Array.<DocumentFragment>|Array.<Element>|NodeList} columns
   * @param {Array.<number>} heights
   */
  distributeItemsToColumns : function(items, columns, heights) {
    var count = items.length,
        yIndices = this.yIndices,
        columnIndex,
        item;

    for (var i = 0; i < count; i++) {
      columnIndex = this.getColumnIndex();
      item = items[i];
      yIndices[columnIndex] += heights[i] + 20;
      columns[columnIndex].appendChild(item);
    }
  },


  /**
   * @param {number} [count]
   * @returns {DocumentFragment}
   */
  createColumns : function(count) {
    var columns = document.createDocumentFragment(),
        column;

    count = count || this.columnCount;

    while (count--) {
      column = document.createElement('div');
      column.className = this.columnClass;
      columns.appendChild(column);
    }

    return columns;
  },


  /**
   * @param {number} [count]
   * @returns {Array.<DocumentFragment>}
   */
  createColumnFragments : function(count) {
    var columns = [];

    count = count || this.columnCount;

    while (count--) {
      columns.push(document.createDocumentFragment());
    }

    return columns;
  },


  /**
   *
   */
  removeColumns : function() {
    var container = this.container,
        column;

    while (column = container.firstChild) {
      container.removeChild(column);
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
   * @returns {Array.<number>}
   */
  getExistingItemHeights : function() {
    var items = this.items,
        heights = [];

    for (var i = 0, l = items.length; i < l; i++) {
      heights.push(items[i].offsetHeight);
    }

    return heights;
  },


  /**
   * @param {Array.<Element>|NodeList} items
   * @returns {Array.<number>}
   */
  getItemHeights : function(items) {
    var temp = document.createElement('div');
    temp.className = this.columnClass;
    temp.style.position = 'absolute';
    temp.style.left = '-10000px';
    temp.style.top = '-10000px';
    temp.style.width = this.container.offsetWidth / this.columnCount + 'px';

    var heights = [],
        i = 0,
        l = items.length;

    for (i; i < l; i++) {
      temp.appendChild(items[i]);
    }

    this.container.appendChild(temp);

    for (i = 0; i < l; i++) {
      heights.push(items[i].offsetHeight);
    }

    this.container.removeChild(temp);

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
   *
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
   * @param {{}}     config
   * @param {number} config.columns
   * @param {string} config.query
   */
  bindToMediaQueryList : function(config) {
    var that = this;

    var mqlListener = function(mql) {
      if (mql.matches) {
        that.columnCount = config.columns;
        if (that.initialized) that.update();
      }
    };

    var mql = window.matchMedia(config.query);
    mql.addListener(mqlListener);
    mqlListener(mql);
  }

};
