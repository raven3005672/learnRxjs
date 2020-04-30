import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// one stream map
Observable.create((observer: any) => {
  observer.next('Hey guys!')
}).pipe(
  map((val: any) => val.toUpperCase())
)
  .subscribe((x: any) => addItem(x))

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

