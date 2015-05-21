var item = document.querySelector('.item-1');
item.addEventListener('click', function(){
  alert('addEventListener: click');
});

var h1 = item.querySelector('h1');
h1.addEventListener('click', function(){
  alert('content > addEventListener: click');
});

var removeButton = document.querySelector('.js-remove-items');
removeButton.addEventListener('click', function(){
  var items = document.querySelectorAll('.removable');
  quartz.remove(items);
});


var quartz = new Quartz({
  containerSelector: '.container',
  columnClass: 'column',
  //columnSelector: '.column',
  columnCount: 3,
  itemSelector: '.item',

  mediaQueries: [
    {
      query: 'screen and (max-width: 39.9375em)',
      columns: 1
    },
    {
      query: 'screen and (min-width: 40em) and (max-width: 49.9375em)',
      columns: 2
    },
    {
      query: 'screen and (min-width: 50em)',
      columns: 3
    }
  ]
});


var addItems = (function(){

  var count = document.querySelectorAll('.item').length;


  function createItem() {
    var element = document.createElement('article'),
        widthClass = Math.random() > 0.7 ? 'w2' : 'w1',
        heightClass = Math.random() > 0.7 ? 'h2' : 'h1';

    element.innerHTML = '<h1>' + ++count + '</h1>';
    element.className = ['item', 'item-' + count, widthClass, heightClass].join(' ');

    return element;
  }


  return function(method) {
    var elements = [],
        i = 0,
        l = 1,
        element;

    for (i; i < l; i++) {
      element = createItem();
      elements.push(element);
    }

    if (method === 'prepend') {
      elements = elements.reverse();
    }
    //mason.container.appendChild(fragment);
    quartz[method](elements);
  };

}());
