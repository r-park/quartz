# Quartz
Quartz is a javascript library for producing pinterest-style layouts that respond to media query changes.

## Browser Support
- Chrome
- Firefox
- IE 9+ (requires matchMedia polyfill)
- Safari

## Installation
**bower**
```
bower install quartz
```
**npm**
```
npm install quartz
```

## Using Quartz
Define your HTML:
```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```
**For IE 9**, include the [provided](https://github.com/r-park/quartz/tree/master/dist) `match-media.js` polyfill, which is a concatenated version of [matchMedia.js](https://github.com/paulirish/matchMedia.js)
```html
<!--[if lt IE 10]>
<script src="match-media.js"></script>
<![endif]-->
```
Setup your CSS grid as you normally would, e.g.
```css
@media screen and (max-width: 39.9375em) {
  .column {
    width: 100%; 
  } 
}

@media screen and (min-width: 40em) and (max-width: 49.9375em) {
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
Initialize Quartz with the media queries from your CSS grid:
```javascript
var quartz = new Quartz({
  container: '.container',
  items: '.item',
  columnClass: 'column',
  mediaQueries: [
    {query: 'screen and (max-width: 39.9375em)', columns: 1},
    {query: 'screen and (min-width: 40em) and (max-width: 49.9375em)', columns: 2},
    {query: 'screen and (min-width: 50em)', columns: 3}
  ]
});
```

## Configuration
`container` : A string selector or HTMLElement<br>
`items` : A string selector, or an array of HTMLElements, or a NodeList<br>
`columnClass` : The CSS class(es) to be applied to columns<br>
`mediaQueries` : Array of media query configuration objects<br><br>

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

// override the currently active media query by providing a columnCount
quartz.update(2);
```

## License
Quartz is free to use under the [open-source MIT license](https://github.com/r-park/quartz/blob/master/LICENSE).
