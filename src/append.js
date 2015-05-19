
var addItems = (function(){

  var count = 7;


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
        fragment = document.createDocumentFragment(),
        i = 0,
        l = 500,
        element;

    for (i; i < l; i++) {
      element = createItem();
      elements.push(element);
      fragment.appendChild(element);
    }

    if (method === 'prepend') {
      elements = elements.reverse();
    }
    //mason.container.appendChild(fragment);
    window[method](elements);
  };

}());
