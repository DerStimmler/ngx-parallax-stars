import { Observable } from 'rxjs';

/** @internal */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** @internal */
export function resizeObservable(element: Element): Observable<{
  width: number;
  height: number;
}> {
  return new Observable((subscriber) => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentRect = entry.contentRect;

        if (Math.abs(contentRect.height) < 1 && Math.abs(contentRect.width) < 1) continue;

        return subscriber.next({
          width: contentRect.width,
          height: contentRect.height,
        });
      }
    });

    resizeObserver.observe(element);

    return function unsubscribe() {
      resizeObserver.unobserve(element);
    };
  });
}
