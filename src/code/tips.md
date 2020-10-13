# 操作符

请求重试 —— retryWhen

## Conbination

combineAll —— 当源observable完成时，对收集的observables使用combineLatest。

combineLatest[(常用)]() —— 当任意observable发出值时，发出每个observable的最新值。每个observable都至少发出一个值后才会发出初始值！

concat[(常用)]() —— 按照顺序，前一个observable完成了再订阅下一个observable并发出值。主要考虑顺序。

concatAll —— 收集observables，当前一个完成时订阅下一个。常见用法：Observable.pipe(map(x => of(x), concatAll())); 常用concatMap替代，concatMap === map + concatAll

forkJoin —— 当所有observables都完成时，发出每个observables的最新值。

merge[(常用)]() —— 多个流合并为一个流，不考虑顺序因素。

mergeAll —— 功能同merge，可以设置同一时间有多少个内部流可以被订阅，其余的流会先暂存等待订阅。

pairwise —— 将前一个值和当前值作为数组返回，[pre, cur]

race —— 使用首先发出值的observable，忽略其他observable的输出，无论后续时间中是否触发时机更早

startWith[(常用)]() —— 以某个初始值开始

withLatestFrom[(常用)]() —— 主从observable，主发出新的值时，获取主与从的当前最新值

zip —— 当observables都发出一个值，才将所有值作为数组发出。如果其中observable完成时，就不会再发出值了。

## Conditional

defaultIfEmpty —— 完成前没有发出任何值，则发出给定的值

every —— 功能同数组的every方法

sequenceEqual —— 按顺序检查两个Observables所发出的所有值是否相等





## 操作符对比

### combineLatest - forkJoin - zip

操作符 | 触发条件 | 输出 | 备注
- | - | - | -
combineLatest | 任一触发 | 输出最新值(可能触发多次) | 内部流必须都触发一次
forkJoin | 都完成 | 输出最新值(只触发一次) | -
zip | 任一触发 | 输出最新值(可能触发多次) | 内部流必须都触发一次，且不能完成
