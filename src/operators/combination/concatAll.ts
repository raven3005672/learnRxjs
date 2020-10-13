/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 16:13:14 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 16:46:28
 */

import { interval, of } from "rxjs";
import { concatAll, map, take } from "rxjs/operators";

/*
 * concatAll(): Observable
 * 收集observables，当前一个完成时订阅下一个。
 * 当源observable发出的速度要比内部observables完成更快时，请小心backpressure（背压）
 * 在很多情况下，你可以只使用单个操作符concatMap来替代。
 * concatMap = map + concatAll
 */

// 示例1：使用observable来进行concatAll

// 每2秒发出值
const source = interval(2000);
const example = source.pipe(
  // 为了演示，增加10并作为observable返回
  map(val => of(val + 10)),
  // 合并内部observables的值
  concatAll()
);
// 输出：'Example with Basic Observable 10', 'Example with Basic Observable 11'...
const subscribe = example.subscribe(val =>
  console.log('Example with Basic Observable:', val)
);


// 示例2：使用promise来进行concatAll

// 创建并解析一个基础的promise
const samplePromise = (val: any) => new Promise(resolve => resolve(val));
// 每2秒发出值
const source2 = interval(2000);
const example2 = source2.pipe(
  map(val => samplePromise(val)),
  // 合并解析过的promise的值
  concatAll()
);
// 输出：'Example with Promise 0', 'Example with Promise 1'...
const subscribe2 = example2.subscribe(val =>
  console.log('Example with Promise:', val)
);


// 示例3：当内部observables完成时进行延迟

const obs1 = interval(1000).pipe(take(5));
const obs2 = interval(500).pipe(take(2));
const obs3 = interval(2000).pipe(take(1));
// 发出3个observables
const source3 = of(obs1, obs2, obs3);
// 按顺序订阅每个内部observable，前一个完成了再订阅下一个
const example3 = source3.pipe(concatAll());
/*
  输出: 0,1,2,3,4,0,1,0
  怎么运行的...
  订阅每个内部 observable 并发出值，当一个完成了才订阅下一个
  obs1: 0,1,2,3,4 (complete)
  obs2: 0,1 (complete)
  obs3: 0 (complete)
*/
const subscribe3 = example3.subscribe(val => console.log(val));