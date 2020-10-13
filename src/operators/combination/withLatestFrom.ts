/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-12 17:23:47 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-12 17:30:43
 */

import { interval } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";

/*
 * withLatestFrom(other: Observable, project: Function): Observable
 * 还提供另一个observable的最新值
 * 如果你希望每当任意observable发出值时各个observable的最新值，请尝试combinelatest
 */

// 示例1：发出频率更快的第二个source的最新值

// 每5秒发出值
const source = interval(5000);
// 每1秒发出值
const secondSource = interval(1000);
const example = source.pipe(
  withLatestFrom(secondSource),
  map(([first, second]) => {
    return `First Source (5s): ${first} Second Source (1s): ${second}`;
  })
);
/*
  输出:
  "First Source (5s): 0 Second Source (1s): 4"
  "First Source (5s): 1 Second Source (1s): 9"
  "First Source (5s): 2 Second Source (1s): 14"
  ...
*/
const subscribe = example.subscribe(val => console.log(val));

// 示例2：第二个source发出频率更慢一点

// 每5秒发出值
const source2 = interval(5000);
// 每1秒发出值
const secondSource2 = interval(1000);
// withLatestFrom 的 observable 比源 observable 慢
const example2 = secondSource2.pipe(
  // 两个 observable 在发出值前要确保至少都有1个值 (需要等待5秒)
  withLatestFrom(source2),
  map(([first, second]) => {
    return `Source (1s): ${first} Latest From (5s): ${second}`;
  })
);
/*
  "Source (1s): 4 Latest From (5s): 0"
  "Source (1s): 5 Latest From (5s): 0"
  "Source (1s): 6 Latest From (5s): 0"
  ...
*/
const subscribe2 = example2.subscribe(val => console.log(val));
