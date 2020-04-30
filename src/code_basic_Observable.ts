import { Observable } from 'rxjs';
// import 'rxjs/add/operator/share';

// 基本创建方式
var observable = Observable.create((observer: any) => {
  try {
    observer.next('Hey guys!');
    observer.next('How are you?');
    setInterval(() => {
      observer.next('I am good')
    }, 2000)
    // observer.complete();
    // observer.next('This will not send!')
  } catch (err) {
    observer.error(err);
  }
})
  // .share();

// share => hot observable
// setTimeout里的observer3也会同时订阅到事件

var observer = observable.subscribe(
  (x: any) => addItem(x),
  (error: any) => addItem(error),
  () => addItem('Completed')
)

// var observer2 = observable.subscribe(
//   (x: any) => addItem(x),
//   (error: any) => addItem(error),
//   () => addItem('Completed')
// )

// observer.add(observer2) // add 之后会被一起被unsubscribe掉

setTimeout(() => {
  observer.unsubscribe();
  var observer3 = observable.subscribe(
    (x: any) => addItem('Subscriber 3:' + x)
  )
}, 6001)

function addItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node)
}

