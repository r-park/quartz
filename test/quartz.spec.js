describe("Quartz", function(){

  var columnClass = 'column',
      columnSelector = '.' + columnClass,
      containerClass = 'container',
      containerSelector = '.' + containerClass,
      itemClass = 'item',
      itemSelector = '.' + itemClass;

  var config;


  function getContainer() {
    return fixture.el.querySelector(containerSelector);
  }

  function getItems() {
    return fixture.el.querySelectorAll(itemSelector);
  }

  function createItem(height) {
    var item = document.createElement('div');
    item.className = itemClass;
    item.style.height = (height || 10) + 'px';
    return item;
  }

  function smallItem() {
    return createStyledItem('item--small');
  }

  function mediumItem() {
    return createStyledItem('item--medium');
  }

  function largeItem() {
    return createStyledItem('item--large');
  }

  function createStyledItem(sizeClass) {
    var item = document.createElement('div');
    item.className = itemClass + ' ' + sizeClass;
    return item;
  }

  function itemsMatch(quartzItems, items) {
    if (quartzItems.length !== items.length) return false;

    return quartzItems.every(function(item, index){
      return item === items[index];
    });
  }


  fixture.setBase('test/fixtures');


  beforeEach(function(){
    config = {
      container: containerSelector,
      items: itemSelector,
      columnClass: columnClass,
      columnCount: 3,
      mediaQueries: [
        {query: 'screen and (max-width: 39.9375em)', columns: 1},
        {query: 'screen and (min-width: 40em) and (max-width: 49.9375em)', columns: 2},
        {query: 'screen and (min-width: 50em)', columns: 3}
      ]
    };
  });


  afterEach(function(){
    fixture.cleanup();
  });


  describe("Constructor", function(){
    it("should accept container as CSS selector", function(){
      fixture.load('container.html');

      var quartz = new Quartz(config);

      expect(quartz.container.nodeType).toBe(1);
      expect(quartz.container).toBe(getContainer());
    });

    it("should accept container as {HTMLElement}", function(){
      fixture.load('container.html');

      config.container = getContainer();
      var quartz = new Quartz(config);

      expect(quartz.container.nodeType).toBe(1);
      expect(quartz.container).toBe(config.container);
    });

    it("should initialize successfully even when container is empty", function(){
      fixture.load('container.html');

      var quartz = new Quartz(config);
      var columns = quartz.container.querySelectorAll(columnSelector);

      expect(columns.length).toBe(quartz.columnCount);
    });

    it("should accept items as CSS selector", function(){
      fixture.load('container-with-items.html');

      config.items = itemSelector;

      var items = getItems();
      var quartz = new Quartz(config);

      expect(Array.isArray(quartz.items)).toBe(true);
      expect(itemsMatch(quartz.items, items)).toBe(true);
    });

    it("should accept items as {HTMLElement}", function(){
      fixture.load('container-with-items.html');

      config.items = fixture.el.querySelector(itemSelector);

      var quartz = new Quartz(config);

      expect(Array.isArray(quartz.items)).toBe(true);
      expect(itemsMatch(quartz.items, [config.items])).toBe(true);
    });

    it("should accept items as {HTMLElement[]}", function(){
      fixture.load('container-with-items.html');

      var items = fixture.el.querySelectorAll(itemSelector);

      config.items = [items[0], items[1]];

      var quartz = new Quartz(config);

      expect(Array.isArray(quartz.items)).toBe(true);
      expect(itemsMatch(quartz.items, config.items)).toBe(true);
    });

    it("should accept items as {jQuery}", function(){
      fixture.load('container-with-items.html');

      config.items = $(itemSelector);

      var quartz = new Quartz(config);

      expect(Array.isArray(quartz.items)).toBe(true);
      expect(itemsMatch(quartz.items, config.items)).toBe(true);
    });

    it("should accept items as {NodeList}", function(){
      fixture.load('container-with-items.html');

      config.items = fixture.el.querySelectorAll(itemSelector);

      var quartz = new Quartz(config);

      expect(Array.isArray(quartz.items)).toBe(true);
      expect(itemsMatch(quartz.items, config.items)).toBe(true);
    });

    it("should set `columnClass`", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);

      expect(quartz.columnClass).toBe(config.columnClass);
    });

    it("should set `columnCount`", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);

      expect(quartz.columnCount > 0).toBe(true);
    });

    it("should set `yIndices`", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);

      expect(Array.isArray(quartz.yIndices)).toBe(true);
    });

    it("should set `initialized`", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);

      expect(quartz.initialized).toBe(true);
    });
  });


  describe("Appending items", function(){
    it("should append item to layout", function(){
      fixture.load('container-with-items-styled.html');

      config.mediaQueries = null; // null to force columnCount to be config.columnCount

      var quartz = new Quartz(config);
      var columns = quartz.container.querySelectorAll(columnSelector);
      var item = smallItem();

      expect(columns.length).toBe(3);

      quartz.append(item);
      expect(columns[2].lastChild).toBe(item);
    });

    it("should append multiple {HTMLElement[]} items to layout", function(){
      fixture.load('container-with-items-styled.html');

      config.mediaQueries = null; // null to force columnCount to be config.columnCount

      var quartz = new Quartz(config);
      var columns = quartz.container.querySelectorAll(columnSelector);
      var items = [
        smallItem(),
        largeItem(),
        mediumItem(),
        smallItem()
      ];

      expect(columns.length).toBe(3);

      quartz.append(items);

      expect(items[0]).toBe(columns[2].children[1]);
      expect(items[1]).toBe(columns[0].lastChild);
      expect(items[2]).toBe(columns[2].lastChild);
      expect(items[3]).toBe(columns[1].lastChild);
    });

    it("should append multiple {NodeList} items to layout", function(){
      fixture.load('container-with-items-styled.html');

      config.mediaQueries = null; // null to force columnCount to be config.columnCount

      var quartz = new Quartz(config);
      var columns = quartz.container.querySelectorAll(columnSelector);

      var tmp = document.createElement('div');
      tmp.appendChild(smallItem());
      tmp.appendChild(largeItem());
      tmp.appendChild(mediumItem());
      tmp.appendChild(smallItem());

      // querySelectorAll instead of childNodes/children
      // in order to avoid picking up non-item nodes
      var items = tmp.querySelectorAll(itemSelector);

      expect(columns.length).toBe(3);

      quartz.append(items);

      expect(items[0]).toBe(columns[2].children[1]);
      expect(items[1]).toBe(columns[0].lastChild);
      expect(items[2]).toBe(columns[2].lastChild);
      expect(items[3]).toBe(columns[1].lastChild);
    });

    it("should append item to empty layout", function(){
      fixture.load('container.html');

      var quartz = new Quartz(config);
      var columns = quartz.container.childNodes;
      var item = smallItem();

      quartz.append(item);

      expect(columns[0].firstChild).toBe(item);
    });
  });


  describe("Prepending items", function(){
    it("should prepend item to layout", function(){
      fixture.load('container-with-items-styled.html');

      config.mediaQueries = null; // null to force columnCount to be config.columnCount

      var items = fixture.el.querySelectorAll(itemSelector);
      var item = smallItem();

      var quartz = new Quartz(config);
      quartz.prepend(item);

      var columns = quartz.container.querySelectorAll(columnSelector);
      expect(columns.length).toBe(3);

      expect(item).toBe(columns[0].firstChild);
      expect(items[0]).toBe(columns[1].firstChild);
      expect(items[1]).toBe(columns[2].firstChild);
      expect(items[2]).toBe(columns[0].lastChild);
    });

    it("should prepend multiple {HTMLElement[]} items to layout", function(){
      fixture.load('container-with-items-styled.html');

      config.mediaQueries = null; // null to force columnCount to be config.columnCount

      var quartz = new Quartz(config);

      var liveItems = fixture.el.querySelectorAll(itemSelector);

      var items = [
        smallItem(),
        largeItem(),
        mediumItem(),
        smallItem()
      ];

      quartz.prepend(items);

      var columns = quartz.container.querySelectorAll(columnSelector);
      expect(columns.length).toBe(3);

      expect(items[0]).toBe(columns[0].firstChild);
      expect(items[1]).toBe(columns[1].firstChild);
      expect(items[2]).toBe(columns[2].firstChild);
      expect(items[3]).toBe(columns[0].children[1]);
      expect(liveItems[0]).toBe(columns[0].lastChild);
      expect(liveItems[1]).toBe(columns[2].lastChild);
      expect(liveItems[2]).toBe(columns[1].lastChild);
    });

    it("should prepend multiple {NodeList} items to layout", function(){
      fixture.load('container-with-items-styled.html');

      config.mediaQueries = null; // null to force columnCount to be config.columnCount

      var quartz = new Quartz(config);

      var liveItems = fixture.el.querySelectorAll(itemSelector);

      var tmp = document.createElement('div');
      tmp.appendChild(smallItem());
      tmp.appendChild(largeItem());
      tmp.appendChild(mediumItem());
      tmp.appendChild(smallItem());

      // querySelectorAll instead of childNodes/children
      // in order to avoid picking up non-item nodes
      var items = tmp.querySelectorAll(itemSelector);

      quartz.prepend(items);

      var columns = quartz.container.querySelectorAll(columnSelector);
      expect(columns.length).toBe(3);

      expect(items[0]).toBe(columns[0].firstChild);
      expect(items[1]).toBe(columns[1].firstChild);
      expect(items[2]).toBe(columns[2].firstChild);
      expect(items[3]).toBe(columns[0].children[1]);
      expect(liveItems[0]).toBe(columns[0].lastChild);
      expect(liveItems[1]).toBe(columns[2].lastChild);
      expect(liveItems[2]).toBe(columns[1].lastChild);
    });

    it("should prepend item to empty layout", function(){
      fixture.load('container.html');

      var quartz = new Quartz(config);
      var item = smallItem();

      quartz.prepend(item);

      var columns = quartz.container.childNodes;

      expect(columns[0].firstChild).toBe(item);
    });
  });


  describe("Removing items", function(){
    it("should remove the provided item from layout", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);
      var item = quartz.container.querySelector('#item-2');

      expect(item.id).toBe('item-2');

      quartz.remove(item);

      expect(quartz.container.querySelector('#item-2')).toBe(null);
    });

    it("should remove multiple {NodeList} items from layout", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);
      var items = quartz.container.querySelectorAll('.js-bulk-remove');

      expect(items.length).toBe(2);

      quartz.remove(items);

      expect(quartz.container.querySelectorAll('.js-bulk-remove').length).toBe(0);
    });

    it("should remove multiple {HTMLElement[]} items from layout", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);
      var items = quartz.container.querySelectorAll('.js-bulk-remove');
      var itemList = [items[0], items[1]];

      expect(items.length).toBe(2);

      quartz.remove(itemList);

      expect(quartz.container.querySelectorAll('.js-bulk-remove').length).toBe(0);
    });

    it("should call `update()`", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);

      sinon.spy(quartz, 'update');

      quartz.remove(createItem());

      expect(quartz.update.calledOnce).toBe(true);
    });
  });


  describe("Removing all items", function(){
    it("should remove all items from internal `items` collection", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);
      quartz.removeAll();

      expect(quartz.items.length).toBe(0);
    });

    it("should remove all items from layout", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);
      quartz.removeAll();

      expect(quartz.container.querySelectorAll(itemSelector).length).toBe(0);
    });

    it("should call `update()`", function(){
      fixture.load('container-with-items.html');

      var quartz = new Quartz(config);

      sinon.spy(quartz, 'update');

      quartz.removeAll();

      expect(quartz.update.calledOnce).toBe(true);
    });
  });


  describe("Updating layout", function(){
    it("should update layout with new column count", function(){
      fixture.load('container.html');

      var quartz = new Quartz(config);
      var newColumnCount = 2;

      expect(quartz.container.querySelectorAll(columnSelector).length).toBe(quartz.columnCount);

      quartz.update(newColumnCount);

      expect(quartz.columnCount).toBe(newColumnCount);
      expect(quartz.container.querySelectorAll(columnSelector).length).toBe(quartz.columnCount);
    });
  });


  describe("Indices", function(){
    describe("yIndices", function(){
      it("should initialize with zero value for each column", function(){
        fixture.load('container.html');

        var quartz = new Quartz(config);
        var i = quartz.columnCount;

        while (i--) expect(quartz.yIndices[i]).toBe(0);
      });
    });

    describe("getColumnIndex()", function(){
      it("should return the column index that has the lowest y-index", function(){
        fixture.load('container.html');

        var quartz = new Quartz(config); // [0,0,0]
        expect(quartz.getColumnIndex()).toBe(0);

        quartz.yIndices = [10,0,0];
        expect(quartz.getColumnIndex()).toBe(1);

        quartz.yIndices = [10,0,10];
        expect(quartz.getColumnIndex()).toBe(1);

        quartz.yIndices = [10,20,10];
        expect(quartz.getColumnIndex()).toBe(0);

        quartz.yIndices = [30,20,10];
        expect(quartz.getColumnIndex()).toBe(2);
      });
    });

    describe("refreshYIndices()", function(){
      it("should update indices by querying heights of live columns", function(){
        fixture.load('container.html');

        config.mediaQueries = null; // null to force columnCount to be config.columnCount

        var quartz = new Quartz(config);
        var columns = quartz.container.querySelectorAll(columnSelector);

        expect(quartz.yIndices).toEqual([0,0,0]);

        columns[0].appendChild(createItem());
        quartz.refreshYIndices();

        expect(quartz.yIndices).toEqual([10,0,0]);

        columns[0].appendChild(createItem());
        columns[2].appendChild(createItem());
        quartz.refreshYIndices();

        expect(quartz.yIndices).toEqual([20,0,10]);

        columns[1].appendChild(createItem(40));
        quartz.refreshYIndices();

        expect(quartz.yIndices).toEqual([20,40,10]);
      });
    });

    describe("resetYIndices()", function(){
      it("should set all indices to zero", function(){
        fixture.load('container.html');

        config.mediaQueries = null; // null to force columnCount to be config.columnCount

        var quartz = new Quartz(config);
        quartz.yIndices = [10,20,30];
        quartz.resetYIndices();

        expect(quartz.yIndices).toEqual([0,0,0]);
      });
    });
  });


  describe("Binding to MediaQueryList notifications", function(){
    it("binding handler should be called by constructor when media queries are provided", function(){
      fixture.load('container.html');
      sinon.spy(Quartz.prototype, 'bindMediaQueries');

      var quartz = new Quartz(config);

      expect(quartz.bindMediaQueries.calledOnce).toBe(true);

      Quartz.prototype.bindMediaQueries.restore();
    });

    it("binding handler should NOT be called by constructor when media queries are not provided", function(){
      fixture.load('container.html');
      sinon.spy(Quartz.prototype, 'bindMediaQueries');

      config.mediaQueries = null;
      var quartz = new Quartz(config);

      expect(quartz.bindMediaQueries.callCount).toBe(0);

      Quartz.prototype.bindMediaQueries.restore();
    });

    it("should bind to MediaQueryList for each media query in `config`", function(){
      fixture.load('container.html');
      sinon.spy(window, 'matchMedia');

      var configMediaQueries = config.mediaQueries;
      config.mediaQueries = null;

      var quartz = new Quartz(config);
      quartz.bindMediaQueries(configMediaQueries);

      expect(window.matchMedia.callCount).toBe(3);
      expect(window.matchMedia.getCall(0).args[0]).toBe(configMediaQueries[0].query);
      expect(window.matchMedia.getCall(1).args[0]).toBe(configMediaQueries[1].query);
      expect(window.matchMedia.getCall(2).args[0]).toBe(configMediaQueries[2].query);
    });

    it("should call `update()` when listener is invoked with matching MediaQueryList", function(){
      fixture.load('container.html');

      config.mediaQueries = null;

      var quartz = new Quartz(config);

      sinon.spy(quartz, 'update');

      $window = {
        matchMedia: function() {
          return {
            addListener: function(){},
            matches: true
          };
        }
      };

      quartz.bindMediaQueries([{query: 'screen and (max-width: 40em)', columns: 1}]);

      expect(quartz.update.calledOnce).toBe(true);
    });

    it("should call `update()` with new column count", function(){
      fixture.load('container.html');

      config.mediaQueries = null;

      var quartz = new Quartz(config);

      sinon.spy(quartz, 'update');

      $window = {
        matchMedia: function() {
          return {
            addListener: function(){},
            matches: true
          };
        }
      };

      quartz.bindMediaQueries([{query: 'screen and (max-width: 40em)', columns: 1}]);

      expect(quartz.update.getCall(0).args[0]).toBe(1);
    });
  });

});
