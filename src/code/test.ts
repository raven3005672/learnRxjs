import { fromEvent, from, Subject, Observable, interval, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';
import { throttleTime, scan, map, take, multicast, refCount } from 'rxjs/operators';

const button = document.querySelector('button');
// 一秒内最多点击一次
fromEvent(button, 'click')
.pipe(
  throttleTime(1000),
  scan(count => count + 1, 0)
)
.subscribe(count => console.log(`Clicked ${count} times`));

// 累加每次点击的鼠标x坐标
fromEvent(button, 'click')
.pipe(
  throttleTime(1000),
  map((event: any) => event.clientX),
  scan((count, clientX) => count + clientX, 0)
)
.subscribe(count => console.log(count));

// observable subject对比
// observable A 0-1-2 B 0-1-2
let a = '';
const clock$ = interval(1000).pipe(
  take(3)
);
const observerA = {
  next(v: any) {
    a += '--A执行了',
    console.log('A next:' + v);
    console.log(a);
  }
}
const observerB = {
  next(v: any) {
    a += '--B执行了',
    console.log('B next:' + v);
    console.log(a);
  }
}
clock$.subscribe(observerA);
setTimeout(() => {
  clock$.subscribe(observerB);
}, 7000)
// subject  A 0-1-2 B 2
const subject = new Subject();
subject.subscribe(observerA);
clock$.subscribe(subject);
setTimeout(() => {
  subject.subscribe(observerB);
}, 2000);

// 多播Observables multicast用法存疑 现在没有connect方法了 只能refCount
const source = from([1,2,3]);
const subject2 = new Subject();
const multicasted = source.pipe(
  multicast(subject2),
  refCount()      // 不加这个没有输出
)
multicasted.subscribe((v) => {
  console.log(v);
});
setTimeout((v) => {
  multicasted.subscribe(v);
}, 1000)

// BehaviorSubject
const subject3 = new BehaviorSubject(0);
subject3.subscribe(console.log);    // 0-1-2-3
subject3.next(1);
subject3.next(2);
subject3.subscribe(console.log);    // 2-3
subject3.next(3);

// ReplaySubject
const subject4 = new ReplaySubject(3);
subject4.subscribe((v: any) => console.log('A:',v));    // 1-2-3-4-5
subject4.next(1);
subject4.next(2);
subject4.next(3);
subject4.next(4);
subject4.subscribe((v: any) => console.log('B:',v));    // 2-3-4-5
subject4.next(5);
const subject5 = new ReplaySubject(100, 500);   // 保存500毫秒内的100个可能存在的值

// AsyncSubject
const subject6 = new AsyncSubject();
subject6.subscribe(console.log);      // 5
subject6.next(1);
subject6.next(2);
subject6.subscribe(console.log);      // 5
subject6.next(5);
subject6.complete();

// 自定义操作符
function multiplyByTen(input: Observable<number>) {
  let output = new Observable((observer) => {
    input.subscribe({
      next: (v:number) => observer.next(10*v),
      error: (err: Error) => observer.error(err),
      complete: () => observer.complete()
    });
  });
  return output;
}
const input = from([1,2,3,4]);
const output = multiplyByTen(input);
output.subscribe(console.log);
// 写成官方的样子 —— 实例运算符是使用this关键字来指代输入的Observable的函数
// Observable.prototype.multiplyByTen = function multiplyByTen() {
//   var input = this;
//   return new Observable((observer) => {
//     input.subscribe({
//       next: (v) => observer.next(10 * v),
//       error: (err) => observer.error(err),
//       complete: () => observer.complete()
//     });
//   });
// }
// 调用方式改为
// const observable = from([1,2,3,4]).multiplyByTen();
