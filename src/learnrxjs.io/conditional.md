# Conditional

## defaultIfEmpty

defaultIfEMpty(defaultValue: any): Observable

### Emit given value If nothing is emitted before completion.

```js
import { defaultIfEmpty } from 'rxjs/operators';
import { of } from 'rxjs';

//emit 'Observable.of() Empty!' when empty, else any values from source
const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));
//output: 'Observable.of() Empty!'
const subscribe = exampleOne.subscribe(val => console.log(val));
```

