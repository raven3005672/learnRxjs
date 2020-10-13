/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 16:57:29 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 18:14:31
 */

import { forkJoin, interval, of, throwError } from "rxjs";
import { catchError, delay, mergeMap, take } from "rxjs/operators";

/*
 * forkJoin(...args, selector: function): Observable
 * 当所有observables完成时，发出每个observables的最新值。
 * 如果你想要多个observables按发出顺序相对应的值得组合，试试zip。
 * 如果内部observable不完成的话，forkJoin永远不会发出值。
 * 为什么使用forkJoin
 * 当有一组observables，但你只关心每个observable最后发出的值时，此操作符是最合适的。
 * 此操作符的一个常见用例是在页面加载（或其他事件）时你希望发起多个请求，并在所有请求都响应后再采取行动。
 * 它可能与Promise.all的使用方式类似。
 * 注意，如果任意作用与forkJoin的内部observable报错的话，对于那些在内部observable上没有正确catch错误，从而导致完成的observable，你将丢失它们的值（参见示例4）。
 * 如果你只关心所有内部observables是否完成的话，可以在外部捕获错误。
 * 还需要注意的是如果observable发出的项多余一个的话，并且你只关心前一个发出的话，那么forkJoin并非正确的选择。
 * 在这种情况下，应该选择像combineLatest或zip这样的操作符。
 */

// 示例1：Observables再不同的时间间隔后完成

const myPromise = (val: any) =>
  new Promise(resolve =>
    setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000)  
  );
// 当所有 observables 完成时，将每个 observable 的最新值作为数组发出
const example = forkJoin(
  // 立即发出 'Hello'
  of('Hello'),
  // 1秒后发出'World'
  of('World').pipe(delay(1000)),
  // 1秒后发出0
  interval(1000).pipe(take(1)),
  // 以1秒的时间间隔发出0和1
  interval(1000).pipe(take(2)),
  // 5秒后解析 'Promise Resolved' 的Promise
  myPromise('RESULT')
);
// 输出：['Hello', 'World', 0, 1, 'Promise Resolved: RESULT']
const subscribe = example.subscribe(val => console.log(val));


// 示例2：发起任意多个请求

const myPromise2 = (val: any) =>
  new Promise(resolve =>
    setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000)
  );
const source2 = of([1,2,3,4,5]);
// 发出数组的全部5个结果
const example2 = source2.pipe(mergeMap(q => forkJoin(...q.map(myPromise2))));
/*
  输出:
  [
   "Promise Resolved: 1",
   "Promise Resolved: 2",
   "Promise Resolved: 3",
   "Promise Resolved: 4",
   "Promise Resolved: 5"
  ]
*/
const subscribe2 = example2.subscribe(val => console.log(val));


// 示例3：在外部处理错误

// 当所有observables完成时，将每个observable的最新值作为数组发出
const example3 = forkJoin(
  // 立即发出'Hello'
  of('Hello'),
  // 1秒后发出'World'
  of('World').pipe(delay(1000)),
  // 抛出错误
  throwError('This will error')
).pipe(catchError(error => of(error)));
// 输出：'This will error'
const subscribe3 = example3.subscribe(val => console.log(val));


// 示例4：当某个内部observable报错时得到成功结果

// 当所有observables完成时，将每个observable的最新值作为数组发出
const example4 = forkJoin(
  // 立即发出'Hello'
  of('Hello'),
  // 1秒后发出'World'
  of('World').pipe(delay(1000)),
  // 抛出错误
  throwError('This will error').pipe(catchError(error => of(error)))
);
// 输出：['Hello', 'World', 'This will error']
const subscribe4 = example4.subscribe(val => console.log(val));
