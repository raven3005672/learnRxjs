/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 18:53:54 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 19:00:42
 */

import { empty, of } from "rxjs";
import { defaultIfEmpty } from "rxjs/operators";

/*
 * defaultIfEmpty(defaultValue: any): Observable
 * 如果在完成前没有发出任何通知，那么发出给定的值。
 */

// 示例1：没有值的Observable.of的默认值

// 当源observable为空时，发出'Observable.of() Empty!'，否则发出源的人一直
const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));
// 输出：'Observable.of() Empty!'
const subscribe = exampleOne.subscribe(val => console.log(val));


// 示例2：Observable.empty的默认是

// 当源 observable 为空时，发出 'Observable.empty()!'，否则发出源的任意值
const example = empty().pipe(defaultIfEmpty('Observable.empty()!'));
// 输出：'Observable.empty()!'
const subscribe2 = example.subscribe(val => console.log(val));
