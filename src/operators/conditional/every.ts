/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 19:02:37 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 19:15:20
 */

import { of } from "rxjs";
import { every } from "rxjs/operators";

/*
 * every(predicate: function, thisArg: any): Observable
 * 如果完成时所有的值都能通过断言，那么发出true，否则发出false
 */

// 示例1：一些值不符合条件

// 发出5个值
const source = of(1, 2, 3, 4, 5);
const example = source.pipe(
  // 每个值都是偶数嘛？
  every(val => val % 2 === 0)
);
// 输出：false
const subscribe = example.subscribe(val => console.log(val));


// 示例2：所有值都符合条件

// 发出5个值
const allEvens = of(2, 4, 6, 8, 10);
const example2 = allEvens.pipe(
  // 每个值都是偶数吗？
  every(val => val % 2 === 0)
);
// 输出：true
const subscribe2 = example2.subscribe(val => console.log(val));
