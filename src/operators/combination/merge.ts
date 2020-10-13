/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 18:14:42 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 18:20:14
 */

import { interval, merge as StaticMerge } from "rxjs";
import { mapTo, merge } from "rxjs/operators";

/*
 * merge(input: Observable): Observable
 * 将多个observables转换成单个observable。
 * 此操作符可以既有静态方法，又有实例方法。
 * 如果产生值的顺序是首要考虑的，那么试试用concat来代替。
 */

// 示例1：使用静态方法合并多个observables

// 每2.5秒发出值
const first = interval(2500);
// 每2秒发出值
const second = interval(2000);
// 每1.5秒发出值
const third = interval(1500);
// 每1秒发出值
const fourth = interval(1000);
// 从一个observable中发出输出值
const example = StaticMerge(
  first.pipe(mapTo('FIRST!')),
  second.pipe(mapTo('SECOND!')),
  third.pipe(mapTo('THIRD')),
  fourth.pipe(mapTo('FOURTH'))
);
// 输出："FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
const subscribe = example.subscribe(val => console.log(val));


// 示例2：使用实例方法合并2个observables

// 每2.5秒发出值
const first2 = interval(2500);
// 每2秒发出值
const second2 = interval(2000);
// 作为实例方法实用
const example2 = first2.pipe(merge(second2));
// 输出：0，1，0，2...
const subscribe2 = example2.subscribe(val => console.log(val));
