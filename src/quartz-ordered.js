'use strict';


var isArray = Array.isArray;


/**
 * @name Quartz
 * @constructor
 *
 * @param {{}}              config
 * @param {string}          config.columnClass
 * @param {number}          [config.columnCount]
 * @param {Element|string}  config.container
 * @param {NodeList|string} config.items
 * @param {Array}           [config.mediaQueries]
 *
 */
function Quartz(config) {
  this.columnClass = config.columnClass;
  this.columnCount = config.columnCount;

  if (typeof config.container === 'string') {
    this.container = document.querySelector(config.container);
  }
  else {
    this.container = config.container;
  }

  if (typeof config.items === 'string') {
    this.items = this.toArray(document.querySelectorAll(config.items));
  }
  else {
    this.items = this.toArray(config.items);
  }

  if (config.mediaQueries && window.matchMedia) {
    this.bindToMediaQueries(config.mediaQueries);
  }
  else {
    this.update();
  }
}


Quartz.prototype = {

  /**
   * @param {Element|Element[]|NodeList} items
   */
  append : function(items) {
    if (typeof items.length === 'undefined') {
      items = [items];
    }

    var container   = this.container,
        columns     = this.createColumnFragments(),
        columnCount = this.columnCount,
        index       = this.items.length % columnCount;

    this.distributeItemsToColumns(items, columns, index);

    for (var i = 0; i < columnCount; i++) {
      container.children[i].appendChild(columns[i]);
    }

    this.items = this.items.concat(this.toArray(items));
  },


  /**
   * @param {Element|Element[]|NodeList} items
   */
  prepend : function(items) {
    if (typeof items.length === 'undefined') {
      items = [items];
    }

    var columns = this.createColumns();

    items = this.toArray(items).concat(this.items);

    this.removeColumns();
    this.distributeItemsToColumns(items, columns.childNodes);
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
   * @param {Element[]|NodeList} items
   * @param {DocumentFragment[]|NodeList} columns
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
   * @returns {DocumentFragment[]}
   */
  createColumnFragments : function(count) {
    var column = [];

    count = count || this.columnCount;

    while (count--) {
      column.push(document.createDocumentFragment());
    }

    return column;
  },


  /**
   *
   */
  removeColumns : function() {
    var container = this.container;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
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
  bindToMediaQueries : function(mediaQueries) {
    var i = mediaQueries.length;
    while (i--) {
      this.bindToMediaQueryList(mediaQueries[i]);
    }
  },


  /**
   * @param {{query:string, columns:number}} config
   */
  bindToMediaQueryList : function(config) {
    var that = this;

    var mqlListener = function(mql) {
      if (mql.matches) {
        that.columnCount = config.columns;
        that.update();
      }
    };

    var mediaQueryList = window.matchMedia(config.query);
    mediaQueryList.addListener(mqlListener);
    mqlListener(mediaQueryList);
  }

};
