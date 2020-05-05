<!-- https://www.jianshu.com/p/16be96d69143 -->

一个核心三个重点，核心就是Observable和Operators，三个重点，核心就是Observable和Operators，三个重点分别是：
observer
Subject
schedulers

简单例子

subscribe是同步执行的

operators的分类

## 创造observable类

### create
```js
const observable = Observable.create((observer) => {
  observer.next('value');
})
observable.subscribe({
  next: () => {},
  complete: () => {},
  error: () => {}
})
```
### of
```js
var source = of(1,2,3)
```
### from
```js
var source = from([1,2,3])
```
### fromPromise
```js
var source = fromPromise(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Hello RxJS!');
  }, 3000)
}))
```
### fromEvent
```js
var source = fromEvent(document.body, 'click')
```
### Empty/never/throw
```js
var source = empty(); // 立即complete
var source = throw('Oop!')  // 立即抛出错误
var source = never()    // ?无穷的observable
```
### interval、timer
```js
var source = interval(1000) // 1000ms一个值0，1，2，3
var source = timer(1000, 5000)  // 第一个参数表示到发送第一个值的间隔时间，第二个参数表示从发送第二个参数开始，每发送一个值得间隔时间，如果第二个参数为空则发送第一个参数后，终止，执行complete函数
```

## 选择器类
### take
获取Observable前几个数然后结束（执行complete方法）
```js
var source = interval(1000)
var example = source.pipe(take(3))
```
### first
取第一个数然后结束。和take(1)效果一样
```js
var source = interval(1000)
var example = source.pipe(first())
```
### takeLast,last
takeLast取最后n个
last取最后一个

## 控制数据流类

### takeUntil
参数为一个Observable，当参数Observable订阅发生，终止takeUntil绑定的observable
```js
const click = fromEvent(document.body, 'click');
const source = interval(1000).pipe(takeUntil(click));
// 点击body时source就会终止
```
### ship
跳过前几个，取后面的。【获取前面几个值的时间还是需要等待的】
### startWith
塞一个初始值给Observable
### concat
concat和concatAll效果是一样的，区别在于concat要传递参数，参数必须是Observable类型。
concat将多个observable串接起来前一个完成好了再执行下一个
```js
const source1 = interval(1000).pipe(take(3));
const source2 = of(3);
const source3 = of(4,5);
const example = source1.pipe(concat(source2, source3));
```
### merge
merge处理的Observable是异步执行的，没有先后顺序
### delay、delayWhen
delay将observable第一次发出订阅的时间延迟
delayWhen的延迟时间由参数函数决定，并且会将主订阅对象发出的值作为参数
```js
var example = interval(300).pipe(
  take(5),
  delayWhen(
    x => Rx.Observable.empty().delay(100 * x * x)
  )
)
```
### debounceTime
debounce在每次收到元素，会把元素cache住并等待一段时间，如果这段时间内已经没有收到任何元素，则把元素送出。如果这段时间有收到新的元素，则会把原本cache住的元素释放掉并重新计时，不断反复。
```js
var example = interval(300).pipe(take(5), debounceTime(1000))
```
### throttleTime
throttle会先开放送出元素，等到有元素被送出就会沉默一段时间，等到时间过了又会继续发送元素，防止某个时间频繁触发，影响效率。
```js
var example = interval(300).pipe(take(5), throttleTime(1000))
```
### distinct/distinctUntilChanged
distinct会和已经拿到的数据比较，过滤掉重复的元素
```js
var example = from([1,2,3,1,2]).pipe(
  zip(interval(300), (x,y) => x),
  distinct()
)
// 1 2 3 complete
```
distinct第一个参数是一个函数。函数返回值就是distinct比较的值。
```js
var source = from([
  {value: 'a'},
  {value: 'b'},
  {value: 'c'},
  {value: 'a'},
  {value: 'a'},
]).pipe(
  zip(Rx.Observable.interval(300), (x,y) => x)
)
```
distinct底层是创建一个set来辅助去重，如果数据很大，可能导致set过大，这个时候就需要设置distinct第二个参数来刷新set，第二个参数是个observable到发起订阅的时候就会清空set
```js
var flushes = interval(1300)
var example = from([1,2,3,1,3]).pipe(
  zip(interval(300), (x,y) => x),
  distinct(
    null, flushes
  )
)
// 1,2,3,3,complete
```
distinctUntilChanged与distinct不同支持就是，distinctUntilChanged只会比较相邻两次输入

## 协调多个Observable类
### combineLastest
协调多个observable，参数Observable中有一个发生变化都会发起订阅（前提是每个observable都有值）
```js
import { timer, combineLatest } from 'rxjs';

// timerOne 在1秒时发出第一个值，然后每4秒发送一次
const timerOne = timer(1000, 4000);
// timerTwo 在2秒时发出第一个值，然后每4秒发送一次
const timerTwo = timer(2000, 4000);
// timerThree 在3秒时发出第一个值，然后每4秒发送一次
const timerThree = timer(3000, 4000);

// 当一个 timer 发出值时，将每个 timer 的最新值作为一个数组发出
const combined = combineLatest(timerOne, timerTwo, timerThree);

const subscribe = combined.subscribe(latestValues => {
  // 从 timerValOne、timerValTwo 和 timerValThree 中获取最新发出的值
    const [timerValOne, timerValTwo, timerValThree] = latestValues;
  /*
      示例:
    timerOne first tick: 'Timer One Latest: 1, Timer Two Latest:0, Timer Three Latest: 0
    timerTwo first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 0
    timerThree first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 1
  */
    console.log(
      `Timer One Latest: ${timerValOne},
     Timer Two Latest: ${timerValTwo},
     Timer Three Latest: ${timerValThree}`
    );
  }
);
```
当combineLastest没有传入第二个参数。返回的订阅值是个数组，但是combineLastest可以传入第二个参数，再发给Observable进行数据处理

### zip
和combineLastest用法基本一样，主要作用也是协调几个observable，zip的特点是只会取几个observable对应的index的值进行计算
```js
const source1 = interval(1000).pipe(take(3));
const source2 = interval(3000).pipe(takee(3));
const example = source1.pipe(zip(source2, (x, y) => {
  return  x + y
}));
example.subscribe({
  next: value => {
    console.log(value);
  },
  error: err => {
    console.log("Error: " + err);
  },
  complete: () => {
    console.log("complete");
  }
});
// 0
// 2
// 4
// complete
```
### withLastestFrom
withLatestFrom和combineLatest用法很类似，withLatestFrom主要特点是：只有在主Observable发起值得时候才会发送订阅，不过如果副Observable没有发送过值，也不会发起订阅。
```js
var main = from('hello').pipe(
  zip(interval(500), (x, y) => x)
)
var some = from([0,1,0,0,0,1]).pipe(
  zip(interval(300), (x, y) => x)
)

var example = main.pipe(
withLatestFrom(some, (x, y) => {
    return y === 1 ? x.toUpperCase() : x;
})
)

example.subscribe({
  next: value => {
    console.log(value);
  },
  error: err => {
    console.log("Error: " + err);
  },
  complete: () => {
    console.log("complete");
  }
});
```

### concatMap
concatMap就是map加上concatAll
### mergeMap
mergeMap同样是mergeAll加上map
### switchMap
swtich对比merge和concat有个特点就是负数observable发起订阅后立即解绑主observable

三个map都有第二个参数，一个回调函数。函数用来处理每个observable发起订阅后的回调操作。函数的参数有4个，分别是：
外部ob送出的元素，内部ob送出的元素，外部ob送出元素的index，内部ob送出元素的index

## 改变数据流结构类
### concatAll
将传递过来的Ob进行梳理，一个个进行订阅，前面的处理完在处理后面的ob，这样原本类似为二维数组的结构就变成一维数组了。
### mergeAll
mergeAll并行处理ob
可以传递一个参数，这个参数表示最大并行处理数量，当处理的obs数量大于这个数字的时候，就需要等待在处理的ob有完成的才会分配资源处理，mergeAll（1）的效果就和concatAll效果一样

## 数据操作类
### map
同js
### filter
执行函数返回值为false就过滤掉
### mapTo
将参数转换为一个固定值
### scan
数据累加计算，scan第二个参数位初始值
### repeat
如果ob没有发生错误，我们也希望可以重复发起订阅，这个时候就要用到repeat方法，repeat用法和retry基本一样
### groupBy
groupBy类型数据库中的group命令

## 缓存类
### buffer、bufferTime、bufferCount




