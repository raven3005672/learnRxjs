/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-13 19:17:31 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-13 19:26:14
 */

import { from, fromEvent, of } from "rxjs";
import { bufferCount, map, mergeMap, sequenceEqual, switchMap, tap } from "rxjs/operators";

/*
 * sequenceEqual(compareTo: Observable, comparor?: (a, b) => boolean): Observable
 * 使用可选的比较函数，按顺序比较两个Observables的所有值，然后返回单个布尔值的Observable，以表示两个序列是否相等。
 * 按顺序检查两个Observables所发出的所有值是否相等。
 */

// 示例1：简单比较

const expectedSequence = from([4, 5, 6]);
of([1,2,3], [4,5,6], [7,8,9])
  .pipe(switchMap(arr => from(arr).pipe(sequenceEqual(expectedSequence))))
  .subscribe(console.log);
// 输出：false，true，false


// 示例2：根据键盘事件比较

const expectedSequence2 = from(['q', 'w', 'e', 'r', 't', 'y']);
const setResult = (text: any) => (document.getElementById('result').innerText = text);
fromEvent(document, 'keydown')
  .pipe(
    map((e: KeyboardEvent) => e.key),
    tap(v => setResult(v)),
    bufferCount(6),
    mergeMap(keyDowns =>
      from(keyDowns).pipe(
        sequenceEqual(expectedSequence2),
        tap(isItQwerty => setResult(isItQwerty ? 'WELL DONE!' : 'TYPE AGAIN!'))
      )
    )
  )
  .subscribe(e => console.log(`did you say qwerty? ${e}`));
  