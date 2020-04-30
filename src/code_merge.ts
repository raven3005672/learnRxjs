import { Observable, merge } from 'rxjs';

// two stream merge
var observable = Observable.create((observer: any) => {
  observer.next('Hey guys!')
})

var observable2 = Observable.create((observer: any) => {
  observer.next('How is it going?')
})

var newObs = merge(observable, observable2);

newObs.subscribe(
  (x: any) => addItem(x)
)

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

