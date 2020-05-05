import { of, Observable, range, generate } from "rxjs";
import { repeat, repeatWhen } from "rxjs/operators";
// create
Observable.create = function(subscribe: any) {
  return new Observable(subscribe);
}
// of
of(1, 2, 3);
// range
range(1, 100);
// generate
generate(
  2,  // 初始值，相当于for循环中的i=2
  value => value < 10,  // 循环的条件，相当于for中的条件判断
  value => value + 2,   // 每次值得递增
  value => value * value  // 产生的结果
)
// repeat
const source$ = of(1, 2, 2);
repeat(10);