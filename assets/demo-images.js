var demo = (function(doc){
  'use strict';


  var count = doc.querySelectorAll('.item').length;


  var imageUrls = [
    'http://i.imgur.com/sBObCaU.jpg',
    'http://i.imgur.com/TNu2PnQ.jpg',
    'http://i.imgur.com/KpqO6Yz.jpg',
    'http://i.imgur.com/SDzUJOV.jpg',
    'http://i.imgur.com/kxZgFPH.jpg',
    'http://i.imgur.com/ZvQ8p4o.jpg',
    'http://i.imgur.com/hFwAej4.jpg',
    'http://i.imgur.com/lME0bAk.jpg',
    'http://i.imgur.com/bKI3vBY.jpg',
    'http://i.imgur.com/MlG6U0n.gif',
    'http://i.imgur.com/ErhhBRN.jpg',
    'http://i.imgur.com/Pkn5EAR.jpg',
    'http://i.imgur.com/oRZngno.jpg',
    'http://i.imgur.com/gXKHVh9.jpg',
    'http://i.imgur.com/HZr8ewr.jpg',
    'http://i.imgur.com/lY1qKvt.jpg',
    'http://i.imgur.com/E2WP5md.jpg'
  ];


  // return random image url with timestamp to prevent caching
  function getImageUrl() {
    return imageUrls[Math.floor(Math.random() * imageUrls.length)] + '?' + Date.now();
  }


  // item factory
  function createItem() {
    var item = doc.createElement('article');
    item.className = 'item';

    var h1 = doc.createElement('h1');
    h1.appendChild(doc.createTextNode(++count));
    h1.className = 'item__title';
    item.appendChild(h1);

    var img = doc.createElement('img');
    img.src = getImageUrl();
    item.appendChild(img);

    var button = doc.createElement('button');
    button.type = 'button';
    button.className = 'item__button btn';
    button.appendChild(doc.createTextNode('×'));
    button.addEventListener('click', function(){ quartz.remove(item); });
    item.appendChild(button);

    return item;
  }


  var quartz;


  $('.item')
    .hide()
    .imagesReady()
    .then(function(items){
      // `items` is $('.item')
      items.show();

      // instantiate Quartz
      quartz = new Quartz({
        container: '.items',
        items: items,
        columnClass: 'items__column column',
        mediaQueries: [
          {query: 'screen and (max-width: 39.99em)', columns: 1},
          {query: 'screen and (min-width: 40em) and (max-width: 49.99em)', columns: 2},
          {query: 'screen and (min-width: 50em)', columns: 3}
        ]
      });
    });


  // demo api
  return {
    append : function() {
      var item = createItem();
      $(item).imagesReady().then(function(){
        quartz.append(item);
      });
    },

    prepend : function() {
      var item = createItem();
      $(item).imagesReady().then(function(){
        quartz.prepend(item);
      });
    },

    remove : function(item) {
      quartz.remove(item);
    },

    removeAll : function() {
      count = 0;
      quartz.removeAll();
    }
  };


}(document));
