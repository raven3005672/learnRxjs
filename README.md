# learnRxjs
<!-- https://www.youtube.com/watch?v=PhggNGsSQyg -->

```shell
yarn init -y
yarn add rxjs webpack webpack-dev-server typescript ts-loader
yarn add webpack-cli --dev

npm init
npm install rxjs webpack webpack-dev-server typescript ts-loader
npm install webpack-cli --save-dev
```

https://cn.rx.js.org/manual/overview.html

## 基本概念

* Observable 可观察对象 - 一个可调用的未来值或事件的集合
* Observer 观察者 - 回调函数的集合，监听由Observable提供的值
* Subscription 订阅 - 表示Observable的执行
* Operators 操作符 - 采用函数式编程风格的纯函数
* Subject 主体 - 相当于EventEmitter，并且是将值或事件多路推送给多个Observer的唯一方式
* Schedulers 调度器 - 用来控制并发，允许我们在发生计算时进行协调【例如setTimeout、requestAnimationFrame】

* Function 惰性的评估运算，调用时会同步地返回一个单一值。
* Generator 惰性的评估运算，调用时会同步地返回零到（有可能的）无限多个值。
* Promise 最终可能（或可能不）返回单个值的运算。
* Observable 惰性的评估运算，它可以从它被调用的时刻起同步或异步地返回零到（有可能的）无限多个值。

订阅Observable类似于调用函数。

Observable传递值可以是同步的，也可以是异步的。

## Observable

Observables使用create或创建操作符创建的，并使用观察者来订阅它，然后执行它并发送next/error/complete通过给观察者，而且执行可能会被清理。

核心关注点：

* 创建Observables
* 订阅Observables
* 执行Observables
* 清理Observables

订阅了Observable会得到一个Subscription。

## Subscription 订阅

subscription.add(childSubscription);
subscription.unsubscribe();

## Subject 主体

特殊类型的Observable，允许将值多播给多个观察者，所以Subject是多播的，普通的Observables是单播的（每个已订阅的观察者都拥有Observable的独立执行）。

var subject = new Subject();
subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

observable的每个订阅者之间，是独立的，完整的享受observable流动下来的数据。

A 0-1-2 B 0-1-2

subject的订阅者之间，是共享一个留下来的数据的。

A 0-1-2 B 2

一些特殊的Subject：BehaviorSubject、ReplaySubject、AsyncSubject

## 多播的Observables

多播Observables在底层是通过使用Subject使得多个观察者可以看见同一个Observable执行。

## 引用计数 refCount()

返回Observable，这个Observable会追踪有多少个订阅者。当订阅者从0变成1，会开启执行，当订阅者数量从1变成0时候，它会完全取消订阅，停止进一步的执行。

refCount的作用是，当有第一个订阅者时，多播Observable会自动地启动执行，而当最后一个订阅者离开时，多播Observable会自动地停止执行。

1 - 2 - 3 没有alert

const source = from([1,2,3]);
const subject2 = new Subject();
const multicasted = source.pipe(
  multicast(subject2),
  refCount()
)
multicasted.subscribe((v:number) => {
  console.log(v);
});
setTimeout(() => {
  multicasted.subscribe(() => {
    alert(12)
  });
}, 1000)

## BehaviorSubject

它保存了发送给消费者的最新值，并且当有新的观察者订阅时，会理解从BehaviorSubject那接收到”当前值“。

BehaviorSubject 适合用来表示”随时间推移的值“。举例来说，生日的流是一个Subject，但年龄的流应该是一个BehaviorSubject。

## ReplaySubject

ReplaySubject记录Observable执行中的多个值并将其回放给新的订阅者。

## AsyncSubject

只有当Observable执行完成时(执行complete())，它才会将执行的最后一个值发送给观察者。

功能和last操作符类似，等待complete通知，以发送一个单个值。

# Operators 操作符

操作符不会改变已经存在的Observable实例。他们返回一个新的Observable，它的subscription逻辑基于第一个Observable。

操作符是函数，它基于当前的Observable创建一个新的Observable。这是一个无副作用的操作，前面的Observable保持不变。

## 实例操作符 vs. 静态操作符

静态操作符是附加到Observable类上的纯函数，通常用来从头开始创建Observable。

创建操作符 - 转换操作符 - 过滤操作符 - 组合操作符 - 多播操作符 - 错误处理操作符 - 工具操作符 - 条件和布尔操作符 - 数学和聚合操作符

## Scheduler 调度器

调度器控制着何时启动subscription和何时发送通知。它由三部分组成：
调度器是一种数据结构。它知道如何根据优先级或其他标准来存储任务和将任务进行排序。
调度器是执行上下文。它表示在何时何地执行任务（举例来说，立即的，或另一种回调函数机制（比如setTimeout或process.nextTick），或动画帧）。
调度器有一个（虚拟的）时钟。调度器功能通过它的的getter方法now()提供了“时间”的概念。在具体调度器上安排的任务将严格遵循该时钟锁表示的时间。


hot Observable => Subject
cold Observable => Observable

自定义的操作符

操作符应该永远返回一个Observable。
确保对你的操作符返回的Observable内部所创建的subscriptions进行管理。
确保处理传入函数中的异常。
确保在返回的Observable的取消订阅处理方法中释放稀缺资源。

function mySimpleOperator(someCallback) {
  // 我们可以在这写 var selft = this; 以保存this，但看下一条注释
  return Observable.create(subscriber => {
    // 因为我们在箭头函数中，this来自于外部作用域
    var source = this;
    // 保存我们的内部subscription
    var subscription = source.subscribe(value => {
      // 重点：从用户提供的回调函数中捕获错误
      try {
        subscriber.next(someCallback(value));
      } catch (err) {
        subscriber.error(err);
      }
    },
    // 确保处理错误，然后视情况而定进行完成并发送它们
    err => subscriber.error(err),
    () => subscriber.complete());
    // 现在返回
    return subscription;
  });
}



Electron
Angular
Starter

竞态条件

eventLoop不是v8的一部分

Promise.resolve(Promise.reject()) 
rejected状态

queueMicrotask api

并发场景下promise能解决，async/await的瓶颈