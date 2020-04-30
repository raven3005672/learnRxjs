import { fromEvent } from 'rxjs'

// 事件创建方式
var observable_ = fromEvent(document, 'mousemove')

setTimeout(() => {
  var subscription = observable_.subscribe(
    (x: any) => addItem(x)
  )
}, 2000)

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

