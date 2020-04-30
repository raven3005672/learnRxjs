import { from } from 'rxjs';
import { pluck } from 'rxjs/operators';

// from Iterable
from([
  { first: 'Gary', last: 'Simon', age: '34' },
  { first: 'Jane', last: 'Simon', age: '34' },
  { first: 'John', last: 'Simon', age: '34' },
]).pipe(
  pluck('first')
)
.subscribe((x: any) => addItem(x))

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

