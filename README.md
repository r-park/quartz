# Quartz
Quartz is a javascript utility for producing pinterest-style layouts that respond to media query changes.

## Installation
**bower**
```
bower install quartz-layout
```
**npm**
```
npm install quartz-layout
```

## Using Quartz
Define your HTML
```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```
**For IE 9**, include the [provided](https://github.com/r-park/quartz/tree/master/dist) polyfill, which is a concatenated version of [matchMedia.js](https://github.com/paulirish/matchMedia.js)
```html
<!--[if lt IE 10]>
<script src="match-media.js"></script>
<![endif]-->
```
Setup your CSS grid as you normally would — for example:
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
Initialize Quartz with the media queries from your CSS grid
```javascript
var config = {
  container: '.container',
  items: '.item',
  columnClass: 'column',
  mediaQueries: [
    {query: 'screen and (max-width: 39.9375em)', columns: 1},
    {query: 'screen and (min-width: 40em) and (max-width: 49.9375em)', columns: 2},
    {query: 'screen and (min-width: 50em)', columns: 3}
  ]
}

var quartz = new Quartz(config)
```

## Configuration Options
```javascript
var config = {}
```
### config.container
```javascript
// CSS selector
config.container = '.container'

// HTMLElement
config.container = document.querySelector('.container')

// jQuery
config.container = $('#container')[0]
```
### config.items
```javascript
// CSS selector
config.container = '.items'

// NodeList
config.container = document.querySelectorAll('.items')

// jQuery
config.container = $('.items')
```
### config.columnClass
```javascript
// CSS class(es) to be applied to columns
config.columnClass = 'column'
```
### config.mediaQueries
```javascript
config.mediaQueries = [
  // `query` should correspond to an @media rule in your CSS stylesheet
  {query: 'screen and (min-width: 40em) and (max-width: 49.9375em)', columns: 2}
]
```

## API
### quartz.append(items)
```javascript
// `items` as HTMLElement
var item = document.querySelector('.item');
quartz.append(item);

// `items` as NodeList
var items = document.querySelectorAll('.item');
quartz.append(items);

// `items` as jQuery
quartz.append($('.item'));
```

### quartz.prepend(items)
```javascript
// `items` as HTMLElement
var item = document.querySelector('.item');
quartz.prepend(item);

// `items` as NodeList
var items = document.querySelectorAll('.item');
quartz.prepend(items);

// `items` as jQuery
quartz.prepend($('.item'));
```

### quartz.remove(items)
```javascript
// `items` as HTMLElement
var item = document.querySelector('.item');
quartz.remove(item);

// `items` as NodeList
var items = document.querySelectorAll('.item');
quartz.remove(items);

// `items` as jQuery
quartz.remove($('.item'));
```

### quartz.update([columnCount])
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
