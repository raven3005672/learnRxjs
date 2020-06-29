# Filtering

## audit

audit(durationSelector: (value) => Observable | Promise): Observable

### Ignore for time based on provided observable, then emit most recent value
___

## auditTime

auditTime(duration: number, scheduler?: Scheduler): Observable

### Ignore for given time then emit most recent value

When you are interested in ignoring a source observable for a given amount of time, you can use auditTime. A possible use case is to only emit certain events (i.e. mouse clicks) at a maximum rate per second. After the specified duration has passed, the timer is disabled and the most recent source value is emitted on the output Observable, and this process repeats for the next source value.

If you want the timer to reset whenever a new event occurs on the source observable, you can use debounceTime

```js
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

// Create observable that emits click events
const source = fromEvent(document, 'click');
// Emit clicks at a rate of at most one click per second
const example = source.pipe(auditTime(1000))
// Output (example): '(1s) --- Clicked --- (1s) --- Clicked' 
const subscribe = example.subscribe(val => console.log('Clicked'));
```
___

## debounce

debounce(durationSelector: function): Observable

### Discard emitted values that take less than the specified time, based on selector function, between output.

```js
import { of, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

//emit four strings
const example = of('WAIT', 'ONE', 'SECOND', 'Last will display');
/*
  Only emit values after a second has passed between the last emission,
  throw away all other values
*/
const debouncedExample = example.pipe(debounce(() => timer(1000)));
/*
  In this example, all values but the last will be omitted
  output: 'Last will display'
*/
const subscribe = debouncedExample.subscribe(val => console.log(val));
```

```js
import { interval, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

//emit value every 1 second, ex. 0...1...2
const interval$ = interval(1000);
//raise the debounce time by 200ms each second
const debouncedInterval = interval$.pipe(debounce(val => timer(val * 200)));
/*
  After 5 seconds, debounce time will be greater than interval time,
  all future values will be thrown away
  output: 0...1...2...3...4......(debounce time over 1s, no values emitted)
*/
const subscribe = debouncedInterval.subscribe(val =>
  console.log(`Example Two: ${val}`)
);
```
___

## debounceTime

debounceTime(dueTime: number, scheduler: Scheduler): Observable

### Discard emitted values that take less than the specified time between output

This operator is popular in scenarios such as type-ahead where the rate of user input must be controlled!

```js
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

// elem ref
const searchBox = document.getElementById('search');

// streams
const keyup$ = fromEvent(searchBox, 'keyup');

// wait .5s between keyups to emit current value
keyup$
  .pipe(
    map((i: any) => i.currentTarget.value),
    debounceTime(500)
  )
  .subscribe(console.log)
```
___

## distinct

distinct(keySelector?, flushes?): Observable

### Emits items emitted that are distinct based on any previously emitted item.

```js
import { of } from 'rxjs';
import { distinct } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 1, 2, 3, 4, 5)
  .pipe(distinct())
  // OUTPUT: 1,2,3,4,5
  .subscribe(console.log);
```

```js
// RxJS v6+
import { from } from 'rxjs';
import { distinct } from 'rxjs/operators';

const obj1 = { id: 3, name: 'name 1' };
const obj2 = { id: 4, name: 'name 2' };
const obj3 = { id: 3, name: 'name 3' };
const vals = [obj1, obj2, obj3];

from(vals)
  .pipe(distinct(e => e.id))
  .subscribe(console.log);

/*
OUTPUT:
{id: 3, name: "name 1"}
{id: 4, name: "name 2"}
 */
```
___

## distinctUntilChanged

distinctUntilChanged(compare: function): Observable

### Only emit when the current value is different than the last.

distinctUntilChanged uses === comparison by default, object references must match!

If you want to compare based on an object property, you can use distinctUntilKeyChanged instead!

```js
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// only output distinct values, based on the last emitted value
const source$ = from([1, 1, 2, 2, 3, 3]);

source$
  .pipe(distinctUntilChanged())
  // output: 1,2,3
  .subscribe(console.log);
```

```js
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const sampleObject = { name: 'Test' };

//Objects must be same reference
const source$ = from([sampleObject, sampleObject, sampleObject]);

// only emit distinct objects, based on last emitted value
source$
  .pipe(distinctUntilChanged())
  // output: {name: 'Test'}
  .subscribe(console.log);
```

```js
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// only output distinct values, based on the last emitted value
const source$ = from([
  { name: 'Brian' },
  { name: 'Joe' },
  { name: 'Joe' },
  { name: 'Sue' }
]);

source$
  // custom compare for name
  .pipe(distinctUntilChanged((prev, curr) => prev.name === curr.name))
  // output: { name: 'Brian' }, { name: 'Joe' }, { name: 'Sue' }
  .subscribe(console.log);
```
___

## distinctUntilKeyChanged

distinctUntilKeyChanged(key, compare: fn): Observable

### Only emit when the specified key value has changed

```js
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';

// only output distinct values, based on the last emitted value
const source$ = from([
  { name: 'Brian' },
  { name: 'Joe' },
  { name: 'Joe' },
  { name: 'Sue' }
]);

source$
  // custom compare based on name property
  .pipe(distinctUntilKeyChanged('name'))
  // output: { name: 'Brian }, { name: 'Joe' }, { name: 'Sue' }
  .subscribe(console.log);
```

```js
import { fromEvent } from 'rxjs';
import { distinctUntilKeyChanged, pluck } from 'rxjs/operators';

const keys$ = fromEvent(document, 'keyup').pipe(
  distinctUntilKeyChanged < KeyboardEvent > 'code',
  pluck('key')
);

keys$.subscribe(console.log);
```
___

## filter

filter(select: Function, thisArg: any): Observable

### Emit values that pass the provided condition.

If you would like to complete an observable when a condition fails, check out takeWhile!

```js
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

//emit (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);
//filter out non-even numbers
const example = source.pipe(filter(num => num % 2 === 0));
//output: "Even number: 2", "Even number: 4"
const subscribe = example.subscribe(val => console.log(`Even number: ${val}`));
```

```js
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

//emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
const source = from([
  { name: 'Joe', age: 31 },
  { name: 'Bob', age: 25 }
]);
//filter out people with age under 30
const example = source.pipe(filter(person => person.age >= 30));
//output: "Over 30: Joe"
const subscribe = example.subscribe(val => console.log(`Over 30: ${val.name}`));
```

```js
import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';

//emit every second
const source = interval(1000);
//filter out all values until interval is greater than 5
const example = source.pipe(filter(num => num > 5));
/*
  "Number greater than 5: 6"
  "Number greater than 5: 7"
  "Number greater than 5: 8"
  "Number greater than 5: 9"
*/
const subscribe = example.subscribe(val =>
  console.log(`Number greater than 5: ${val}`)
);
```
___

## find

find(predicate: function)

### Emit the first item that passes predicate then complete.

If you always want the first item emitted, regardless of condition, try first()!

```js
import { fromEvent } from 'rxjs';
import { find, repeatWhen, mapTo, startWith, filter } from 'rxjs/operators';

// elem ref
const status = document.getElementById('status');

// streams
const clicks$ = fromEvent(document, 'click');

clicks$
  .pipe(
    find((event: any) => event.target.id === 'box'),
    mapTo('Found!'),
    startWith('Find me!'),
    // reset when click outside box
    repeatWhen(() =>
      clicks$.pipe(filter((event: any) => event.target.id !== 'box'))
    )
  )
  .subscribe(message => (status.innerHTML = message));
```
___

## first

first(predicate: function, select: function)

### Emit the first value of first to pass provided expression.

The counterpart to first is last!

First will deliver an EmptyError to the Observer's error callback if the Observable completes before any next notification was sent. If you don't want this behavior, use take(1) instead.

```js
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
//no arguments, emit first value
const example = source.pipe(first());
//output: "First value: 1"
const subscribe = example.subscribe(val => console.log(`First value: ${val}`));
```

```js
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
//emit first item to pass test
const example = source.pipe(first(num => num === 5));
//output: "First to pass test: 5"
const subscribe = example.subscribe(val =>
  console.log(`First to pass test: ${val}`)
);
```

```js
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
//no value will pass, emit default
const example = source.pipe(first(val => val > 5, 'Nothing'));
//output: 'Nothing'
const subscribe = example.subscribe(val => console.log(val));
```
___

## ignoreElements

ignoreElements(): Observable

### Ignore everything but complete and error.

```js
import { interval } from 'rxjs';
import { take, ignoreElements } from 'rxjs/operators';

//emit value every 100ms
const source = interval(100);
//ignore everything but complete
const example = source.pipe(take(5), ignoreElements());
//output: "COMPLETE!"
const subscribe = example.subscribe(
  val => console.log(`NEXT: ${val}`),
  val => console.log(`ERROR: ${val}`),
  () => console.log('COMPLETE!')
);
```

```js
import { interval, throwError, of } from 'rxjs';
import { mergeMap, ignoreElements } from 'rxjs/operators';

//emit value every 100ms
const source = interval(100);
//ignore everything but error
const error = source.pipe(
  mergeMap(val => {
    if (val === 4) {
      return throwError(`ERROR AT ${val}`);
    }
    return of(val);
  }),
  ignoreElements()
);
//output: "ERROR: ERROR AT 4"
const subscribe = error.subscribe(
  val => console.log(`NEXT: ${val}`),
  val => console.log(`ERROR: ${val}`),
  () => console.log('SECOND COMPLETE!')
);
```
___

## last

last(predicate: function): Observable

### Emit the last value emitted from source on completion, based on provided expression.

The counterpart to last is first!

```js
import { from } from 'rxjs';
import { last } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
//no arguments, emit last value
const example = source.pipe(last());
//output: "Last value: 5"
const subscribe = example.subscribe(val => console.log(`Last value: ${val}`));
```

```js
import { from } from 'rxjs';
import { last } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
//emit last even number
const exampleTwo = source.pipe(last(num => num % 2 === 0));
//output: "Last to pass test: 4"
const subscribeTwo = exampleTwo.subscribe(val =>
  console.log(`Last to pass test: ${val}`)
);
```

```js
import { from } from 'rxjs';
import { last } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
//no values will pass given predicate, emit default
const exampleTwo = source.pipe(last(v => v > 5, 'Nothing!'));
//output: 'Nothing!'
const subscribeTwo = exampleTwo.subscribe(val => console.log(val));
```
___

## sample

sample(sampler: Observable): Observable

### Sample from source when provided observable emits.

```js
import { interval } from 'rxjs';
import { sample } from 'rxjs/operators';

//emit value every 1s
const source = interval(1000);
//sample last emitted value from source every 2s
const example = source.pipe(sample(interval(2000)));
//output: 2..4..6..8..
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { interval, zip, from } from 'rxjs';
import { sample } from 'rxjs/operators';

const source = zip(
  //emit 'Joe', 'Frank' and 'Bob' in sequence
  from(['Joe', 'Frank', 'Bob']),
  //emit value every 2s
  interval(2000)
);
//sample last emitted value from source every 2.5s
const example = source.pipe(sample(interval(2500)));
//output: ["Joe", 0]...["Frank", 1]...........
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { fromEvent, merge } from 'rxjs';
import { sample, mapTo } from 'rxjs/operators';

const listener = merge(
  fromEvent(document, 'mousedown').pipe(mapTo(false)),
  fromEvent(document, 'mousemove').pipe(mapTo(true))
)
  .pipe(sample(fromEvent(document, 'mouseup')))
  .subscribe(isDragging => {
    console.log('Were you dragging?', isDragging);
  });
```
___

## single

single(a: Function): Observable

### Emit single item that passes expression.

```js
import { from } from 'rxjs';
import { single } from 'rxjs/operators';

//emit (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);
//emit one item that matches predicate
const example = source.pipe(single(val => val === 4));
//output: 4
const subscribe = example.subscribe(val => console.log(val));
```
___

## skip

skip(the: Number): Observable

### Skip the provided number of emitted values.

Skip allows you to ignore the first x emissions from the source. Generally skip is used when you have an observable that always emits certain values on subscription that you wish to ignore. Perhaps those first few aren't needed or you are subscribing to a Replay or BehaviorSubject and do not need to act on the initial values. Reach for skip if you are only concerned about later emissions.

You could mimic skip by using filter with indexes. Ex. .filter((val, index) => index > 1)

```js
import { interval } from 'rxjs';
import { skip } from 'rxjs/operators';

//emit every 1s
const source = interval(1000);
//skip the first 5 emitted values
const example = source.pipe(skip(5));
//output: 5...6...7...8........
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { from } from 'rxjs';
import { skip, filter } from 'rxjs/operators';

const numArrayObs = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 3,4,5...
const skipObs = numArrayObs.pipe(skip(2)).subscribe(console.log);

// 3,4,5...
const filterObs = numArrayObs
  .pipe(filter((val, index) => index > 1))
  .subscribe(console.log);

//Same output!
```
___

## skipUntil

skipUntil(the: Observable): Observable

### Skip emitted values from source until provided observable emits.

```js
import { interval, timer } from 'rxjs';
import { skipUntil } from 'rxjs/operators';

//emit every 1s
const source = interval(1000);
//skip emitted values from source until inner observable emits (6s)
const example = source.pipe(skipUntil(timer(6000)));
//output: 5...6...7...8......
const subscribe = example.subscribe(valu => console.log(val));
```
___

## skipWhile

skipWhile(predicate: Function): Observable

### Skip emitted values from source until provided expression is false.

```js
import { interval } from 'rxjs';
import { skipWhile } from 'rxjs/operators';

//emit every 1s
const source = interval(1000);
//skip emitted values from source while value is less than 5
const example = source.pipe(skipWhile(val => val < 5));
//output: 5...6...7...8......
const subscribe = example.subscribe(val => console.log(val));
```
___

## take

take(count: number): Observable

### Emit provided number of values before completing

When you are interested in only the first emission, you want to use take. Maybe you want to see what the user first clicked on when they entered the page, or you would want to subscribe to the click event and just take the first emission. Another use-case is when you need to take a snapshot of data at a particular point in time but do not require further emissions. For example, a stream of user token updates, or a route guard based on a stream in an Angular application.

If you want to take a variable number of values based on some logic, or another observable, you can use takeUntil or takeWhile!

take is the opposite of skip where take will take the first n number of emissions while skip will skip the first n number of emissions.

```js
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

//emit 1,2,3,4,5
const source = of(1, 2, 3, 4, 5);
//take the first emitted value then complete
const example = source.pipe(take(1));
//output: 1
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

//emit value every 1s
const interval$ = interval(1000);
//take the first 5 emitted values
const example = interval$.pipe(take(5));
//output: 0,1,2,3,4
const subscribe = example.subscribe(val => console.log(val));
```

```html
<div id="locationDisplay">
  Where would you click first?
</div>
```

```js
import { fromEvent } from 'rxjs';
import { take, tap } from 'rxjs/operators';

const oneClickEvent = fromEvent(document, 'click').pipe(
  take(1),
  tap(v => {
    document.getElementById(
      'locationDisplay'
    ).innerHTML = `Your first click was on location ${v.screenX}:${v.screenY}`;
  })
);

const subscribe = oneClickEvent.subscribe();
```
___

## takeLast

takeLast(count: number): Observable

### Emit the last n emitted values before completion

If you want only the last emission from multiple observables, on completion of multiple observables, try forkJoin!

```js
import { of } from 'rxjs';
import { takeLast } from 'rxjs/operators';

const source = of('Ignore', 'Ignore', 'Hello', 'World!');
// take the last 2 emitted values
const example = source.pipe(takeLast(2));
// Hello, World!
const subscribe = example.subscribe(val => console.log(val));
```
___

## takeUntil

takeUntil(notifier: Observable): Observable

### Emit values until provided observable emits.

If you only need a specific number of values, try take!

```js
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//emit value every 1s
const source = interval(1000);
//after 5 seconds, emit value
const timer$ = timer(5000);
//when timer emits after 5s, complete source
const example = source.pipe(takeUntil(timer$));
//output: 0,1,2,3
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { interval } from 'rxjs/observable/interval';
import { takeUntil, filter, scan, map, withLatestFrom } from 'rxjs/operators';

//emit value every 1s
const source = interval(1000);
//is number even?
const isEven = val => val % 2 === 0;
//only allow values that are even
const evenSource = source.pipe(filter(isEven));
//keep a running total of the number of even numbers out
const evenNumberCount = evenSource.pipe(scan((acc, _) => acc + 1, 0));
//do not emit until 5 even numbers have been emitted
const fiveEvenNumbers = evenNumberCount.pipe(filter(val => val > 5));

const example = evenSource.pipe(
  //also give me the current even number count for display
  withLatestFrom(evenNumberCount),
  map(([val, count]) => `Even number (${count}) : ${val}`),
  //when five even numbers have been emitted, complete source observable
  takeUntil(fiveEvenNumbers)
);
/*
    Even number (1) : 0,
  Even number (2) : 2
    Even number (3) : 4
    Even number (4) : 6
    Even number (5) : 8
*/
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { fromEvent } from 'rxjs';
import { takeUntil, mergeMap, map } from 'rxjs/operators';

const mousedown$ = fromEvent(document, 'mousedown');
const mouseup$ = fromEvent(document, 'mouseup');
const mousemove$ = fromEvent(document, 'mousemove');

// after mousedown, take position until mouse up
mousedown$
  .pipe(
    mergeMap(_ => {
      return mousemove$.pipe(
        map((e: any) => ({
          x: e.clientX,
          y: e.clientY
        })),
        // complete inner observable on mouseup event
        takeUntil(mouseup$)
      );
    })
  )
  .subscribe(console.log);
```
___

## takeWhile

takeWhile(predicate: function(value, index): boolean, inclusive?: boolean): Observable

### Emit values until provided expression is false.

When the optional inclusive parameter is set to true it will also emit the first item that didn't pass the predicate.

```js
import { of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

//emit 1,2,3,4,5
const source$ = of(1, 2, 3, 4, 5);

//allow values until value from source is greater than 4, then complete
source$
  .pipe(takeWhile(val => val <= 4))
  // log: 1,2,3,4
  .subscribe(val => console.log(val));
```

```js
import { of } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

const source$ = of(1, 2, 3, 9);

source$
  // with inclusive flag, the value causing the predicate to return false will also be emitted
  .pipe(takeWhile(val => val <= 3, true))
  // log: 1, 2, 3, 9
  .subscribe(console.log);
```

```js
import { of } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

// emit 3, 3, 3, 9, 1, 4, 5, 8, 96, 3, 66, 3, 3, 3
const source$ = of(3, 3, 3, 9, 1, 4, 5, 8, 96, 3, 66, 3, 3, 3);

// allow values until value from source equals 3, then complete
source$
  .pipe(takeWhile(it => it === 3))
  // log: 3, 3, 3
  .subscribe(val => console.log('takeWhile', val));

source$
  .pipe(filter(it => it === 3))
  // log: 3, 3, 3, 3, 3, 3, 3
  .subscribe(val => console.log('filter', val));
```
___

## throttle

throttle(durationSelector: function(value): Observable | Promise): Observable

### Emit value on the leading edge of an interval, but suppress new values until durationSelector has completed.

```js
import { interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

//emit value every 1 second
const source = interval(1000);
//throttle for 2 seconds, emit latest value
const example = source.pipe(throttle(val => interval(2000)));
//output: 0...3...6...9
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { interval } from 'rxjs';
import { throttle, map } from 'rxjs/operators';

//emit value every 1 second
const source = interval(1000);
//incrementally increase the time to resolve based on source
const promise = val =>
  new Promise(resolve =>
    setTimeout(() => resolve(`Resolved: ${val}`), val * 100)
  );
//when promise resolves emit item from source
const example = source.pipe(
  throttle(promise),
  map(val => `Throttled off Promise: ${val}`)
);

const subscribe = example.subscribe(val => console.log(val));
```
___

## throttleTime

throttleTime(duration: number, scheduler: Scheduler, config: ThrottleCOnfig): Observable

### Emit first value then ignore for specified duration

```js
import { interval } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

// emit value every 1 second
const source = interval(1000);
/*
  emit the first value, then ignore for 5 seconds. repeat...
*/
const example = source.pipe(throttleTIme(5000));
// output: 0...6...12
const subscribe = example.subscribe(val => console.log(val));
```

```js
import { interval, asyncScheduler } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

const source = interval(1000);
/*
  emit the first value, then ignore for 5 seconds. repeat...
*/
const example = source.pipe(
  throttleTime(5000, asyncScheduler, { trailing: true })
);
// output: 5...11...17
const subscribe = example.subscribe(val => console.log(val));
```
