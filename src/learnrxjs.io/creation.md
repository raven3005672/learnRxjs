# Creation

## ajax

ajax(urlOrRequest: string | AjaxRequest)

### Create an observable for an Ajax request with either a request object with url, headers, etc or a string for a URL.

```js
import { ajax } from 'rxjs/ajax';

const githubUsers = `https://api.github.com/users?per_page=2`;
const users = ajax(githubUsers);
// const users = ajax.getJSON(githubUsers);
// const githubUsers = `https://api.github.com/error`;
// const users = ajax({
//   url: githubUsers,
//   method: 'GET',
//   headers: {
//     /*some headers*/
//   },
//   body: {
//     /*in case you need a body*/
//   }
// });
const subscribe = users.subscribe(
  res => console.log(res),
  err => console.error(err)
)
```
___

## create

create(subscribe: function)

### Create an observable with given subscription function.

```js
import { Observable } from 'rxjs';
/*
  Create an observable that emits 'Hello' and 'World' on  
  subscription.
*/
const hello = Observable.create(function(observer) {
  observer.next('Hello');
  observer.next('World');
  observer.complete();
});

//output: 'Hello'...'World'
const subscribe = hello.subscribe(val => console.log(val));
```

```js
import { Observable } from 'rxjs';
/*
  Increment value every 1s, emit even numbers.
*/
const evenNumbers = Observable.create(function(observer) {
  let value = 0;
  const interval = setInterval(() => {
    if (value % 2 === 0) {
      observer.next(value);
    }
    value++;
  }, 1000);

  return () => clearInterval(interval);
});
//output: 0...2...4...6...8
const subscribe = evenNumbers.subscribe(val => console.log(val));
//unsubscribe after 10 seconds
setTimeout(() => {
  subscribe.unsubscribe();
}, 10000);
```

```js
import { Observable } from 'rxjs';
/*
  Increment value every 1s, emit even numbers.
*/
const evenNumbers = Observable.create(function(observer) {
  let value = 0;
  const interval = setInterval(() => {
    if (value % 2 === 0) {
      observer.next(value);
    }
    value++;
  }, 1000);

  return () => clearInterval(interval);
});
//output: 0...2...4...6...8
const subscribe = evenNumbers.subscribe(val => console.log(val));
//unsubscribe after 10 seconds
setTimeout(() => {
  subscribe.unsubscribe();
}, 10000);
```
___

## defer

defer(observableFactory: function(): SubscribableOrPromise): Observable

### Create an observable with given subscription function.

```js
import { defer, of, timer, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const s1 = of(new Date()); //will capture current date time
const s2 = defer(() => of(new Date())); //will capture date time at the moment of subscription

console.log(new Date());

timer(2000)
  .pipe(switchMap(_ => merge(s1, s2)))
  .subscribe(console.log);

/*
OUTPUT => 
2019-02-10T12:38:30.000Z (currrent date/time from first console log)
2019-02-10T12:38:30.000Z (date/time in s1 console log, captured date/time at the moment of observable creation)
2019-02-10T12:38:32.000Z (date/time in s2 console log, captured date/time at the moment of subscription)
*/
```
___

## empty

empty(scheduler: Scheduler): Observable

### Observable that immediately completes.

```js
import { empty } from 'rxjs';

//output: 'Complete!'
const subscribe = empty().subscribe({
  next: () => console.log('Next'),
  complete: () => console.log('Complete!')
});
```

```js
// Time remaining: 10 => 9 => ... => 0
// click pause to pause, click resume to resume
import { interval, fromEvent, merge, empty } from 'rxjs';
import { switchMap, scan, takeWhile, startWith, mapTo } from 'rxjs/operators';

const countdownSeconds = 10;
const setHTML = id => val => (document.getElementById(id).innerHTML = val);
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const interval$ = interval(1000).pipe(mapTo(-1));

const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
const resume$ = fromEvent(resumeButton, 'click').pipe(mapTo(true));

const timer$ = merge(pause$, resume$)
  .pipe(
    startWith(true),
    // if timer is paused return empty observable
    switchMap(val => (val ? interval$ : empty())),
    scan((acc, curr) => (curr ? curr + acc : acc), countdownSeconds),
    takeWhile(v => v >= 0)
  )
  .subscribe(setHTML('remaining'));
```
___

## from

from(ish: ObservableInput, mapFn: function, thisArg: any, scheduler: Scheduler): Observable

### Turn an array, promise, or iterable into an observable.

```js
import { from } from 'rxjs';

//emit array as a sequence of values
const arraySource = from([1, 2, 3, 4, 5]);
//output: 1,2,3,4,5
const subscribe = arraySource.subscribe(val => console.log(val));
```

```js
import { from } from 'rxjs';

//emit result of promise
const promiseSource = from(new Promise(resolve => resolve('Hello World!')));
//output: 'Hello World'
const subscribe = promiseSource.subscribe(val => console.log(val));
```

```js
import { from } from 'rxjs';

//works on js collections
const map = new Map();
map.set(1, 'Hi');
map.set(2, 'Bye');

const mapSource = from(map);
//output: [1, 'Hi'], [2, 'Bye']
const subscribe = mapSource.subscribe(val => console.log(val));
```

```js
import { from } from 'rxjs';

//emit string as a sequence
const source = from('Hello World');
//output: 'H','e','l','l','o',' ','W','o','r','l','d'
const subscribe = source.subscribe(val => console.log(val));
```

## fromEvent

fromEvent(target: EventTargetLike, eventName: string, selector: function): Observable

### Turn event into observable sequence.

```js
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

//create observable that emits click events
const source = fromEvent(document, 'click');
//map to string with given event timestamp
const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
//output (example): 'Event time: 7276.390000000001'
const subscribe = example.subscribe(val => console.log(val));
```
___

## generate

generate(initialStateOrOptions: GenerateOptions, condition?: ConditionFunc, iterate?: IterateFunc, resultSelectorOrObservable?: (ResultFunc) | SchedulerLike, scheduler?: SchedulerLike): Observable

### Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.

```js
import { generate } from 'rxjs';

generate(
  2,
  x => x <= 8,
  x => x + 3
).subscribe(console.log);

/*
OUTPUT:
2
5
8
*/
```

```js
import { generate } from 'rxjs';

generate(
  2,
  x => x <= 38,
  x => x + 3,
  x => '.'.repeat(x)
).subscribe(console.log);

/*
OUTPUT:
..
.....
........
...........
..............
.................
....................
.......................
..........................
.............................
................................
...................................
......................................
*/
```
___

## interval

interval(period: number, scheduler: Scheduler): Observable

### Emit numbers in sequence based on provided timeframe.

```js
import { interval } from 'rxjs';

//emit value in sequence every 1 second
const source = interval(1000);
//output: 0,1,2,3,4,5....
const subscribe = source.subscribe(val => console.log(val));
```
___

## of

of(...values, scheduler: Scheduler): Observable

### Emit variable amount of values in a sequence and then emits a complete notification.

```js
import { of } from 'rxjs';
//emits any number of provided values in sequence
const source = of(1, 2, 3, 4, 5);
//output: 1,2,3,4,5
const subscribe = source.subscribe(val => console.log(val));
```

```js
import { of } from 'rxjs';
//emits values of any type
const source = of({ name: 'Brian' }, [1, 2, 3], function hello() {
  return 'Hello';
});
//output: {name: 'Brian'}, [1,2,3], function hello() { return 'Hello' }
const subscribe = source.subscribe(val => console.log(val));
```
___

## range

range(start: number, count: number, scheduler: Scheduler): Observable

### Emit numbers in provided range in sequence.

```js
import { range } from 'rxjs';

//emit 1-10 in sequence
const source = range(1, 10);
//output: 1,2,3,4,5,6,7,8,9,10
const example = source.subscribe(val => console.log(val));
```

## throw

throw(error: any, scheduler: Scheduler): Observable

### Emit error on subscription.

```js
import { throwError } from 'rxjs';

//emits an error with specified value on subscription
const source = throwError('This is an error!');
//output: 'Error: This is an error!'
const subscribe = source.subscribe({
  next: val => console.log(val),
  complete: () => console.log('Complete!'),
  error: val => console.log(`Error: ${val}`)
});
```
___

## timer

timer(initialDelay: number | Date, period: number, scheduler: Scheduler): Observable

### After given duration, emit numbers in sequence every specified duration.

```js
import { timer } from 'rxjs';

//emit 0 after 1 second then complete, since no second argument is supplied
const source = timer(1000);
//output: 0
const subscribe = source.subscribe(val => console.log(val));
```

```js
import { timer } from 'rxjs';

/*
  timer takes a second argument, how often to emit subsequent values
  in this case we will emit first value after 1 second and subsequent
  values every 2 seconds after
*/
const source = timer(1000, 2000);
//output: 0,1,2,3,4,5......
const subscribe = source.subscribe(val => console.log(val));
```
