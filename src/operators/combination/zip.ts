/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-12 17:33:35 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-12 18:48:43
 */

import { interval, of, zip } from "rxjs";
import { delay, take } from "rxjs/operators";

/*
 * zip(observables: *): Observable
 * 在所有observables发出后，将它们的值作为数组发出
 * zip操作符会订阅所有内部observables，然后等待每个发出一个值。一旦发生这种情况，将发出具有相应索引的所有值。
 * 这会持续进行，直到至少一个内部observable完成。
 * 与interval或timer进行组合，zip可以用来根据另一个observable进行定时输出！
 */

// 示例1：以交替的时间间隔对多个observables进行zip

const sourceOne = of('Hello');
const sourceTwo = of('World!');
const sourceThree = of('Goodbye');
const sourceFour = of('World!');
// 一直等到所有observables都发出一个值，才将所有值作为数组发出
const example = zip(
  sourceOne,
  sourceTwo.pipe(delay(1000)),
  sourceThree.pipe(delay(2000)),
  sourceFour.pipe(delay(3000))
);
// 输出：['Hello', 'World!', 'Goodbye', 'World!']
const subscribe = example.subscribe(val => console.log(val));

// 示例2：当一个observable完成时进行zip

// 每1秒发出值
const source2 = interval(1000);
// 当一个 observable 完成时，便不会再发出更多的值了
const example2 = zip(source2, source2.pipe(take(2)));
// 输出: [0,0]...[1,1]
const subscribe2 = example2.subscribe(val => console.log(val));
