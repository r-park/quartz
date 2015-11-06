var demo = (function(doc){
  'use strict';


  var count = doc.querySelectorAll('.item').length;


  // varying-length content
  var quotes = [
    "He inferred that universe–ending paradoxes would ensue should he break his promise.",
    "I think these things are pretty safe.",
    "Permission to speak freely, sir?",
    "Green-blooded hobgoblin.",
    "Dammit, man! I'm a doctor, not a physicist!",
    "We are traveling at warp speed. How did you manage to beam aboard this ship?",
    "Well, that's brilliant. Do they still have sandwiches there?",
    "Since my customary farewell would appear oddly self-serving, I shall simply say...",
    "I've never beamed three people from two targets onto one pad before!",
    "So, the Enterprise has had its maiden voyage, has it? She is one well–endowed lady. I'd like to get my hands on her `ample nacelles`, if you pardon the engineering parlance.",
    "What if I told you that your transwarp theory was correct, that it is indeed possible to beam onto a ship that is traveling at warp speed?",
    "Don't pander to me, kid. One tiny crack in the hull and our blood boils in thirteen seconds. Solar flare might crop up, cook us in our seats. And wait'll you're sitting pretty with a case of Andorian shingles, see if you're still so relaxed when your eyeballs are bleeding. Space is disease and danger wrapped in darkness and silence."
  ];


  // return random item from quotes array
  function getContent() {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }


  // item factory
  function createItem() {
    var item = doc.createElement('article');
    item.className = 'item';

    var h1 = doc.createElement('h1');
    h1.appendChild(doc.createTextNode(++count));
    h1.className = 'item__title';
    item.appendChild(h1);

    var p = doc.createElement('p');
    p.appendChild(doc.createTextNode(getContent()));
    p.className = 'item__text';
    item.appendChild(p);

    var button = doc.createElement('button');
    button.type = 'button';
    button.className = 'item__button btn';
    button.appendChild(doc.createTextNode('×'));
    button.addEventListener('click', function(){ quartz.remove(item); });
    item.appendChild(button);

    return item;
  }


  // instantiate Quartz
  var quartz = new Quartz({
    container: '.items',
    items: '.item',
    columnClass: 'items__column column',
    mediaQueries: [
      {query: 'screen and (max-width: 39.99em)', columns: 1},
      {query: 'screen and (min-width: 40em) and (max-width: 49.99em)', columns: 2},
      {query: 'screen and (min-width: 50em)', columns: 3}
    ]
  });


  // demo api
  return {
    append : function() {
      quartz.append(createItem());
    },

    prepend : function() {
      quartz.prepend(createItem());
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
