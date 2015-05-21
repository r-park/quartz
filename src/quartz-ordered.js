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
        index = this.items.length % columnCount;

    this.distributeItemsToColumns(items, columns, index);

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
    var columns  = this.createColumns();

    items = items.concat(this.items);

    this.removeColumns();
    this.distributeItemsToColumns(items, columns.childNodes);
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

    var columns = this.createColumns();

    this.removeColumns();
    this.distributeItemsToColumns(this.items, columns.childNodes);
    this.container.appendChild(columns);
  },


  /**
   * @param {Array.<Element>|NodeList} items
   * @param {Array.<DocumentFragment>|Array.<Element>|NodeList} columns
   * @param {number} [startIndex]
   */
  distributeItemsToColumns : function(items, columns, startIndex) {
    var count = items.length,
        index = startIndex || 0,
        maxIndex = this.columnCount - 1;

    for (var i = 0; i < count; i++) {
      columns[index].appendChild(items[i]);

      if (index === maxIndex) {
        index = 0;
      }
      else {
        index++;
      }
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
