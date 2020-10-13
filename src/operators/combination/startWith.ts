/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-12 16:16:37 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-12 17:25:21
 */

import { interval, of } from "rxjs";
import { scan, startWith } from "rxjs/operators";


/*
 * startWith(an: Values): Observable
 * 发出给定的第一个值。
 * BehaviorSubject也可以从初始值开始。
 */

// 示例1：对数字序列使用startWith

// 发出(1,2,3)
const source = of(1,2,3);
// 从0开始
const example = source.pipe(startWith(0));
// 输出0，1，2，3
const subscribe = example.subscribe(console.log);

// 示例2：startWith用作scan的初始值

// 发出 ('World!', 'Goodbye', 'World!')
const source2 = of('World!', 'Goodbye', 'World!');
// 以 'Hello' 开头，后面接当前字符串
const example2 = source2.pipe(
  startWith('Hello'),
  scan((acc, curr) => `${acc} ${curr}`)
);
/*
  输出:
  "Hello"
  "Hello World!"
  "Hello World! Goodbye"
  "Hello World! Goodbye World!"
*/
const subscribe2 = example2.subscribe(val => console.log(val));

// 示例3：使用多个值进行startWith

// 每1秒发出值
const source3 = interval(1000);
// 以-3，-2，-1开始
const example3 = source3.pipe(startWith(-3, -2, -1));
// 输出：-3，-2，-1，0，1，2 ...
const subscribe3 = example3.subscribe(val => console.log(val));
