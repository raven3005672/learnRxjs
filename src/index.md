Observable - Observer
可被观察者 - 被观察者

Observable设计模式: Observer Pattern(观察者模式) & Iterator Pattern(迭代器模式)

Observable是一个发布者，通过subscibe函数和观察者Observer连接起来

```
// 迭代器应具有的功能
const iterator = getIterator();
while (iteator.isDone()) {
  console.log(iterator.getCurrent());
  iterator.moveToNext();
}
```

无 subscribe，则 Observable 不执行。

Hot Observable: 对于过去的数据，新的订阅者无法接受到
Cold Observable: 对于过去的数据，新的订阅者可以获取到

```
// Cold
const cold$ = new Observable(observer => {
  const producer = new Producer();
  // 然后让 observer 去接受 producer 产生的数据
})

// Hot
const producer = new Producer();
const hot$ = new Observable(observer => {
  // 然后让 observer 去接受 producer 产生的数据
})
```

实现一个操作符

返回一个全新的Observable对象。
对上游和下游的订阅及退订处理。
处理异常情况。
及时释放资源。

function map(project) {
  return new Observable(observer => {
    const sub = this.subscribe({
      next: value => {
        try {
          observer.next(project(value));
        } catch (err) {
          observer.error(err);
        }
      },
      error: err => observer.next(err),
      complete: () => observer.complete(),
    });
    return {
      unsubscribe: () => {
        sub.unsubscribe();
      }
    }
  })
}

const result$ = source$.map(x => x * 2);

