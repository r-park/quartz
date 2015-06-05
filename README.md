# Quartz
[Quartz](http://r-park.github.io/quartz/) is a javascript utility for producing responsive **pinterest**-style layouts.

## Features
- Balanced column heights
- Append items
- Prepend items
- Remove items
- Allows manual refresh of layout
- Adjusts column count by reacting to MediaQueryList events
- No dependencies for modern browsers (IE 9 requires a match-media polyfill)

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
**For IE 9**, include the [provided](https://github.com/r-park/quartz/tree/master/dist) `match-media.min.js` polyfill, which is a concatenated and minified copy of [matchMedia.js](https://github.com/paulirish/matchMedia.js).
```html
<!--[if lt IE 10]>
<script src="match-media.min.js"></script>
<![endif]-->
```
Initialize Quartz with the responsive media queries from your stylesheet
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
config.items = '.item'

// NodeList
config.items = document.querySelectorAll('.item')

// jQuery
config.items = $('.item')
```
### config.columnClass
```javascript
// CSS class(es) to be applied to columns
config.columnClass = 'column foo'
```
### config.mediaQueries
```javascript
config.mediaQueries = [
  // `query` should correspond to an @media rule in your stylesheet
  {query: 'screen and (min-width: 40em) and (max-width: 49.9375em)', columns: 2}
]
```

## API
### quartz.append(items)
```javascript
// `items` as HTMLElement
var item = document.querySelector('.item');
quartz.append(item);

// `items` as array of HTMLElement
var items = [document.querySelector('#item-1'), document.querySelector('#item-2')];
quartz.append(items);

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

// `items` as array of HTMLElement
var items = [document.querySelector('#item-1'), document.querySelector('#item-2')];
quartz.prepend(items);

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

// `items` as array of HTMLElement
var items = [document.querySelector('#item-1'), document.querySelector('#item-2')];
quartz.remove(items);

// `items` as NodeList
var items = document.querySelectorAll('.item');
quartz.remove(items);

// `items` as jQuery
quartz.remove($('.item'));
```

### quartz.removeAll()
```javascript
quartz.removeAll();
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
