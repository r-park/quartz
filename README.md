# Quartz
Quartz is a javascript column layout library.

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

#### Appending items
```javascript
// single item
var item = document.querySelector('.item');
quartz.append(item);

// collection of items
var items = document.querySelectorAll('.item');
quartz.append(items);
```

#### Prepending items
```javascript
// single item
var item = document.querySelector('.item');
quartz.prepend(item);

// collection of items
var items = document.querySelectorAll('.item');
quartz.prepend(items);
```

#### Removing items
```javascript
// single item
var item = document.querySelector('.item');
quartz.remove(item);

// collection of items
var items = document.querySelectorAll('.item');
quartz.remove(items);
```

#### Manual updates
```javascript
// manually refresh the layout
quartz.update();

// force layout to change to 2 columns
quartz.update(2);
```
