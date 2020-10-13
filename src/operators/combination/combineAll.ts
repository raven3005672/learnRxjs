/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 10:19:26 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 14:57:52
 */

import { interval } from "rxjs";
import { combineAll, map, take } from "rxjs/operators";

/*
 * combineALl(project: function): Observable
 * 当源Observable完成时，对收集的observables使用combineLatest。
 */

// 示例1：映射成内部的interval observable

// 每秒发出值，并只取前2个
const source = interval(1000).pipe(take(2));
// 将source发出的每个值映射成取前5个值的interval observable
const example = source.pipe(
  map(val => interval(1000).pipe(map(i => `Result (${val}): ${i}`), take(5)))
);
/*
  source中的2个值会被映射成2个(内部的)interval observables，
  这2个内部observables每秒使用combineLatest策略来combineAll，
  每当任意一个内容observable发出值，就会发出每个内部observable的最新值。
*/
const combined = example.pipe(combineAll());
/*
  输出:
  ["Result (0): 0", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 4"]
*/
const subscribe = combined.subscribe(val => console.log(val));
