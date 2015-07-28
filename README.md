[![Build Status](https://travis-ci.org/r-park/quartz.svg?branch=master)](https://travis-ci.org/r-park/quartz)
[![Coverage Status](https://coveralls.io/repos/r-park/quartz/badge.svg?branch=master&service=github)](https://coveralls.io/github/r-park/quartz?branch=master)
[![npm version](https://badge.fury.io/js/quartz-layout.svg)](http://badge.fury.io/js/quartz-layout)
[![Bower version](https://badge.fury.io/bo/quartz.svg)](http://badge.fury.io/bo/quartz)

# Quartz
**<a href="http://r-park.github.io/quartz/" target="_blank">Quartz</a>** is a javascript utility for producing responsive **pinterest**-style layouts. Quartz prioritizes **balanced column heights** over strict item ordering.

- View text <a href="http://r-park.github.io/quartz/" target="_blank">example</a>
- View image pre-loading <a href="http://r-park.github.io/quartz/images-example.html" target="_blank">example</a>

## Features
- API for **appending**, **prepending**, and **removing** items
- API for manual refresh of layout
- Balanced column heights
- All styling is controlled by your CSS
- Adjusts column count by responding to MediaQueryList events
- No dependencies for modern browsers

## Installation
**bower**
```
bower install quartz
```
**npm**
```
npm install quartz-layout
```

## Using Quartz
**Define your HTML** — a `container` element is required. The container can be empty, or pre-populated with items as show below. Use your own class names for the container and items.
```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

**Include the javascript files**. For IE 9 support, include the [provided](https://github.com/r-park/quartz/tree/master/dist) `match-media.min.js` polyfill, which is a concatenated and minified copy of [matchMedia.js](https://github.com/paulirish/matchMedia.js).
```html
<!--[if lt IE 10]>
<script src="match-media.min.js"></script>
<![endif]-->
<script src="quartz.min.js"></script>
```

**Setup your CSS grid** as you normally would – for example:
```css
@media screen {
  .column {
    width: 100%;
  }
}

@media screen and (min-width: 40em) {
  .column {
    width: 50%;
  }
}

@media screen and (min-width: 50em) {
  .column {
    width: 33.3333333333%;
  }
}
```

Initialize Quartz with your configuration settings.
```javascript
var config = {
  container: '.container',
  items: '.item',
  columnClass: 'column',
  mediaQueries: [
    // max-width is required for smallest size
    {query: 'screen and (max-width: 39.99em)', columns: 1},
    // both min- and max-width are required for intermediate sizes
    {query: 'screen and (min-width: 40em) and (max-width: 49.99em)', columns: 2},
    {query: 'screen and (min-width: 50em)', columns: 3}
  ]
}

var quartz = new Quartz(config)
```

## Using Quartz with images
In order for Quartz to maintain balanced column heights, images must be pre-loaded so that their heights can be included in the overall item height calculations.

One way to accomplish this is to use a utility like <a href="https://github.com/r-park/images-ready" target="_blank">ImagesReady</a>. For example:

```javascript
$('.item')
    .imagesReady()
    .then(function(items){ // `items` is $('.item')
      // instantiate Quartz
      quartz = new Quartz({
        container: '.container',
        items: items,
        columnClass: 'items__column column',
        mediaQueries: [
          {query: 'screen and (max-width: 39.99em)', columns: 1},
          {query: 'screen and (min-width: 40em) and (max-width: 49.99em)', columns: 2},
          {query: 'screen and (min-width: 50em)', columns: 3}
        ]
      });
    });
```

## Configuration Options
```javascript
var config = {}
```

### config.container
Required
```javascript
// CSS selector
config.container = '.container'

// HTMLElement
config.container = document.querySelector('.container')

// jQuery
config.container = $('#container')[0]
```

### config.items
Required
```javascript
// CSS selector
config.items = '.item'

// Array of HTMLElement
config.items = [document.querySelector('#item-1'), document.querySelector('#item-2')]

// NodeList
config.items = document.querySelectorAll('.item')

// jQuery
config.items = $('.item')
```

### config.columnClass
Required
```javascript
// CSS class(es) to be applied to columns
config.columnClass = 'column foo'
```

### config.mediaQueries
Required

- List media queries in order, from smallest to largest.
- `max-width` is required for smallest size
- Both `min-width` and `max-width` are required for intermediate sizes

If your CSS looks like this:
```css
@media screen {
  .column { width: 100%; } /* 1 column */
}

@media screen and (min-width: 40em) {
  .column { width: 50%; } /* 2 columns */
}

@media screen and (min-width: 50em) {
  .column { width: 33.3333333333%; } /* 3 columns */
}
```
Your configuration should look like this:
```javascript
config.mediaQueries = [
  {query: 'screen and (max-width: 39.99em)', columns: 1},
  {query: 'screen and (min-width: 40em) and (max-width: 49.99em)', columns: 2},
  {query: 'screen and (min-width: 50em)', columns: 3}
]
```

## API
### quartz.append(items)
Add the provided item(s) to the end of the layout.
```javascript
// `items` as a single HTMLElement
var item = document.querySelector('.item');
quartz.append(item);

// `items` as an array of HTMLElement
var items = [document.querySelector('#item-1'), document.querySelector('#item-2')];
quartz.append(items);

// `items` as a NodeList
var items = document.querySelectorAll('.item');
quartz.append(items);

// `items` as jQuery
quartz.append($('.item'));
```

### quartz.prepend(items)
Add the provided item(s) to the beginning of the layout.
```javascript
// `items` as a single HTMLElement
var item = document.querySelector('.item');
quartz.prepend(item);

// `items` as an array of HTMLElement
var items = [document.querySelector('#item-1'), document.querySelector('#item-2')];
quartz.prepend(items);

// `items` as a NodeList
var items = document.querySelectorAll('.item');
quartz.prepend(items);

// `items` as jQuery
quartz.prepend($('.item'));
```

### quartz.remove(items)
Remove the provided item(s) from the layout.
```javascript
// `items` as a single HTMLElement
var item = document.querySelector('#item-4');
quartz.remove(item);

// `items` as an array of HTMLElement
var items = [document.querySelector('#item-2'), document.querySelector('#item-6')];
quartz.remove(items);

// `items` as a NodeList
var items = document.querySelectorAll('.item--disabled');
quartz.remove(items);

// `items` as jQuery
quartz.remove($('.item--saved'));
```

### quartz.removeAll()
Remove all items from the layout.
```javascript
quartz.removeAll();
```

### quartz.update([columnCount])
Force an update of the layout – all heights will be re-evaluated. Passing an optional `columnCount` will change the number of columns in the layout.
```javascript
// manually refresh the current layout
quartz.update();

// change the current layout to a two column layout
quartz.update(2);
```

## Browser Support
- Chrome
- Firefox
- IE 9+
- Safari

NOTE: IE 9 requires the provided matchMedia [polyfill](https://github.com/r-park/quartz/tree/master/dist)

## Module Support
- AMD
- CommonJS
- Browser global

## License
Quartz is free to use under the [open-source MIT license](https://github.com/r-park/quartz/blob/master/LICENSE).
