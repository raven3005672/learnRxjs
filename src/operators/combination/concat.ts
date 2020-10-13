/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 15:25:20 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 16:11:20
 */

import { interval, of } from "rxjs";
import { concat as StaticConcat } from "rxjs";
import { concat, delay } from "rxjs/operators";

/*
 * concat(observables: ...*): Observable
 * 按照顺序，前一个observable完成了再订阅下一个observable并发出值
 * 此操作符可以既有静态方法，又有实例方法。
 * 如果生产量是首要考虑的，而不需要关心产生值得顺序，那么试试用merge来代替。
 */

// 示例1：concat 2个基础的observables

// 发出1，2，3
const sourceOne = of(1, 2, 3);
// 发出4，5，6
const sourceTwo = of(4, 5, 6);
// 先发出sourceOne的值，当完成时订阅sourceTwo
const example = sourceOne.pipe(concat(sourceTwo));
// 输出：1，2，3，4，5，6
const subscribe = example.subscribe(val =>
  console.log('Example: Basic concat:', val)
);


// 示例2：concat作为静态方法

// 发出1，2，3
const sourceOne2 = of(1, 2, 3);
// 发出4，5，6
const sourceTwo2 = of(4, 5, 6);
// 作为静态方法使用
const example2 = StaticConcat(sourceOne2, sourceTwo2);
// 输出：1，2，3，4，5，6
const subscribe2 = example2.subscribe(val => console.log(val));


// 示例3：使用延迟的source observable进行concat

// 发出1，2，3
const sourceOne3 = of(1, 2, 3);
// 发出4，5，6
const sourceTwo3 = of(4, 5, 6);
// 延迟3秒，然后发出
const sourceThree3 = sourceOne3.pipe(delay(3000));
// sourceTwo要等待sourceOne完成才能订阅
const example3 = sourceThree3.pipe(concat(sourceTwo3));
// 输出：1，2，3，4，5，6
const subscribe3 = example3.subscribe(val =>
  console.log('Example: Delayed source one:', val)  
);


// 示例4：使用不完成的source observable进行concat

// 当source永远不完成时，随后的observables永远不会运行
const source4 = StaticConcat(interval(1000), of('This', 'Never', 'Runs'));
// 输出：0，1，2，3，4...
const subscribe4 = source4.subscribe(val => console.log('Example: Source never completes, second observable never runs:', val));
