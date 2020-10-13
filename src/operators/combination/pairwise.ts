/*
 * @Author: yanglinylin.yang 
 * @Date: 2020-10-12 14:28:10 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2020-10-12 16:14:00
 */

import { interval } from "rxjs";
import { pairwise, take } from "rxjs/operators";

/*
 * pairwise(): Observable<Array>
 * 将前一个值和当前值作为数组发出
 */

// 示例1
interval(1000)
  .pipe(
    pairwise(),
    take(5)
  )
  .subscribe(console.log);
// 返回: [0,1], [1,2], [2,3], [3,4], [4,5]