import { Observable } from 'rxjs';

// err触发直接终结Observable
const onSubscribe = (observer: any) => {
  let number = 1;
  const handler = setInterval(() => {
    console.log('in obSubscibe ', number)
    observer.next(number++);
    // observer.error('Something Wrong')
    if (number > 3) {
      // clearInterval(handler);
      observer.complete();
    }
  }, 1000);
}

const source$ = new Observable(onSubscribe);

const theObserver = {
  next: (item: any) => console.log(item),
  error: (err: any) => console.log(err),
  complete: () => console.log('No more Data')
}

var subscription = source$.subscribe(theObserver)

setTimeout(() => {
  subscription.unsubscribe()
}, 2500)

