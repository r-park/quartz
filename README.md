# Quartz
Quartz is a javascript column layout library.

## Browser Support
- Chrome
- Firefox
- IE 9+ (requires matchMedia polyfill)
- Safari

## Installation
#### bower
```
bower install quartz
```
#### npm
```
npm install quartz --save
```

## Using Quartz
```javascript
var quartz = new Quartz({
  container: '.container',
  items: '.item',
  columnClass: 'column',
  columnCount: 3,
  mediaQueries: [
    {query: 'screen and (max-width: 39.9375em)', columns: 1},
    {query: 'screen and (min-width: 40em) and (max-width: 49.9375em)', columns: 2},
    {query: 'screen and (min-width: 50em)', columns: 3}
  ]
});
```
**For IE 9**, include the [provided](https://github.com/r-park/quartz/tree/master/dist) `match-media.js` polyfill, which is a concatenated version of [matchMedia.js](https://github.com/paulirish/matchMedia.js)
```html
<!--[if lt IE 10]>
<script src="match-media.js"></script>
<![endif]-->
```

## Configuration
`container` : a string selector or element<br>
`items` : a string selector, array of elements, or a NodeList<br>
`columnClass` : a string representing the css class(es) to be applied to columns<br>
`columnCount` : initial number of columns to display; not required if `mediaQueries` are provided<br>
`mediaQueries` : optional array of media-query configuration objects<br><br>

## Appending items
```javascript
// a single item
var item = document.querySelector('.item');
quartz.append(item);

// a collection of items
var items = document.querySelectorAll('.item');
quartz.append(items);

// jQuery
quartz.append($('.item'));
```

## Prepending items
```javascript
// a single item
var item = document.querySelector('.item');
quartz.prepend(item);

// a collection of items
var items = document.querySelectorAll('.item');
quartz.prepend(items);

// jQuery
quartz.prepend($('.item'));
```

## Removing items
```javascript
// a single item
var item = document.querySelector('.item');
quartz.remove(item);

// a collection of items
var items = document.querySelectorAll('.item');
quartz.remove(items);

// jQuery
quartz.remove($('.item'));
```

## Updating the layout
```javascript
// manually refresh the layout
quartz.update();

// force layout to change to 2 columns
quartz.update(2);
```
