var item = document.querySelector('.item-1');
item.addEventListener('click', function(){
  alert('addEventListener: click');
});

var h1 = item.querySelector('h1');
h1.addEventListener('click', function(){
  alert('content > addEventListener: click');
});

init({
  containerSelector: '.container',
  columnClass: 'column',
  columnSelector: '.column',
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
