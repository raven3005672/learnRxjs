/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-12 14:52:01 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-12 16:12:56
 */

import { interval, of, race } from "rxjs";
import { delay, map, mapTo } from "rxjs/operators";

/*
 * race(): Observable
 * 使用首先发出值的Observable
 */

// 示例1：使用4个observables进行race

// 接收第一个发出值的observable
const example = race(
  // 每1.5秒发出值
  interval(1500),
  // 每1秒发出值
  interval(1000).pipe(mapTo('1s won!')),
  // 每2秒发出值
  interval(2000),
  // 每2.5秒发出值
  interval(2500)
);
// 输出 1s won! ... 1s won! ...
const subscribe = example.subscribe(console.log);


// 示例2：使用error进行race

// 抛出错误并忽略其他的observables
const first = of('first').pipe(
  delay(100),
  map(_ => {
    throw 'error';
  })
);
const second = of('second').pipe(delay(200));
const third = of('third').pipe(delay(300));
// nothing logged
race(first, second, third).subscribe(val => console.log(val));
