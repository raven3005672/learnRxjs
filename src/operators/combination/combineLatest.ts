/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 15:00:06 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 15:22:45
 */

import { combineLatest, fromEvent, timer } from "rxjs";
import { map, mapTo, scan, startWith, tap } from "rxjs/operators";

/*
 * combineLatest(observables: ...Observable, project: function): Observable
 * 当任意observable发出值时，发出每个observable的最新值。
 * 此操作符可以既有静态方法，又有实例方法。
 * 当源observable完成时，可以使用combineAll来应用combineLatest以发出observables！
 * 为什么使用combineLatest?
 * 当有多个长期活动的observables且它们依靠彼此来进行一些计算或决定时，此操作符是最合适的。
 * 示例3可作为基础示例演示，来自多个按钮的事件被组合在一起，以生成每个按钮的计数和总体总数。
 * RxJS文档中的combineLatest操作符的示例BMI计算也可作为示例。
 * 注意，combineLatest直到每个observable都至少发出一个值后才会发出初始值。
 * 这和withLatestFrom的行为是一致的，这常常会成为陷阱，既没有输出，也不报错，但是一个(或多个)内部observables可能无法正常工作，或者订阅延迟。
 * 最后，如果你只需要observables发出一个值，或只需要它们完成前的最新值时，forkJoin会是更好的选择。
 */

// 示例1：组合3个定时发送的observables

// timerOne在1秒时发出第一个值，然后每4秒发送一次
const timerOne = timer(1000, 4000);
// timerTwo 在2秒时发出第一个值，然后每4秒发送一次
const timerTwo = timer(2000, 4000);
// timerThree 在3秒时发出第一个值，然后每4秒发送一次
const timerThree = timer(3000, 4000);
// 当一个timer发出值时，将每个timer的最新值作为一个数组发出
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


// 示例2：使用projection函数的combineLatest

// timerOne 在1秒时发出第一个值，然后每4秒发送一次
const timerOne2 = timer(1000, 4000);
// timerTwo 在2秒时发出第一个值，然后每4秒发送一次
const timerTwo2 = timer(2000, 4000);
// timerThree 在3秒时发出第一个值，然后每4秒发送一次
const timerThree2 = timer(3000, 4000);

// combineLatest 还接收一个可选的 projection 函数
const combinedProject = combineLatest(
  timerOne2,
  timerTwo2,
  timerThree2,
  (one, two, three) => {
    return `Timer One (Proj) Latest: ${one}, 
              Timer Two (Proj) Latest: ${two}, 
              Timer Three (Proj) Latest: ${three}`;
  }
);
// 输出值
const subscribe2 = combinedProject.subscribe(latestValuesProject =>
  console.log(latestValuesProject)
);


// 示例3：组合2个按钮的事件

// 用来设置 HTML 的辅助函数
const setHtml = (id: any) => (val: any) => (document.getElementById(id).innerHTML = val);
const addOneClick$ = (id: any) =>
  fromEvent(document.getElementById(id), 'click').pipe(
    // 将每次点击映射成1
    mapTo(1),
    startWith(0),
    // 追踪运行中的总数
    scan((acc, cur) => acc + cur),
    // 为适当的元素设置HTML
    tap(setHtml(`${id}Total`))
  );
const combineTotal$ = combineLatest(addOneClick$('red'), addOneClick$('black'))
  .pipe(map(([val1, val2]) => val1 + val2))
  .subscribe(setHtml('total'))

// HTML
// <div>
//   <button id='red'>Red</button>
//   <button id='black'>Black</button>
// </div>
// <div>Red: <span id="redTotal"></span> </div>
// <div>Black: <span id="blackTotal"></span> </div>
// <div>Total: <span id="total"></span> </div>