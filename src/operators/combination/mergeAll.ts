/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 18:27:09 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 18:40:54
 */

import { interval, of } from "rxjs";
import { delay, map, mergeAll, take } from "rxjs/operators";

/*
 * mergeAll(concurrent: number): Observable
 * 收集并订阅所有的observables。
 * 在很多情况下，可以只使用单个操作符mergeMap来替代。
 * mergeMap === map + mergeAll
 */

// 示例1：使用promise来进行concatAll

const myPromise = (val: any) =>
  new Promise(resolve => setTimeout(() => resolve(`Result: ${val}`), 2000));
// 发出1，2，3
const source = of(1, 2, 3);
const example = source.pipe(
  // 将每个值映射成promise
  map(val => myPromise(val)),
  // 发出source的结果
  mergeAll()
);
/*
  输出:
  "Result: 1"
  "Result: 2"
  "Result: 3"
*/
const subscribe = example.subscribe(val => console.log(val));


// 示例2：使用并发的参数来进行mergeAll

const source2 = interval(500).pipe(take(5));
/*
  interval每0.5秒发出一个值。这个值会被映射成延迟1秒的interval。
  mergeAll操作符接收一个可选参数以决定在同一时间有多少个内部observables可以被订阅。
  其余的observables会先暂存以等待订阅。
*/
const example2 = source2.pipe(
  map(val => source2.pipe(delay(1000), take(3))),
  mergeAll(2)
)
.subscribe(val => console.log(val));
// 一旦操作符发出了所有值，则subscription完成
