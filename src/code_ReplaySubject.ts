import { ReplaySubject } from 'rxjs'

var subject = new ReplaySubject(2);

subject.subscribe(
  data => addItem('Observer1 :' + data),
  err => addItem(err),
  () => addItem('Observer 1 Completed')
)

subject.next('The first thing has been sent')
// the last 2 will be subscribe
subject.next('Another thing has been sent')
subject.next('...Observer 2 is about to subscribe...')

var observer2 = subject.subscribe(
  data => addItem('Observer2 :' + data)
)

subject.next('The second thing has been sent')
subject.next('A third thing has been sent')

observer2.unsubscribe();

subject.next('A final thing has been sent')

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

