import { ReplaySubject } from 'rxjs'

var subject = new ReplaySubject(30, 200);

subject.subscribe(
  data => addItem('Observer1 :' + data),
  err => addItem(err),
  () => addItem('Observer 1 Completed')
)

var i = 1;
var int = setInterval(() => {
  subject.next(i++);
}, 100);

setTimeout(() => {
  var observer2 = subject.subscribe(
    data => addItem('Observer2 :' + data)
  )
}, 500)

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

