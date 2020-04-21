@tootallnate/once
=================
### Creates a Promise that waits for a single event


Installation
------------

Install with `npm`:

``` bash
$ npm install @tootallnate/once
```


API
---

## once<T>(emitter: EventEmitter, name: string): CancelablePromise<T>

Creates a promise that waits for event name `name` to occur and resolves the
promise with the value of the first argument of the event handler function. If an
`error` event occurs before the event specified by `name`, then the promise is
rejected with the error argument.

The promise is cancelable, meaning that you may invoke `promise.cancel()` to
remove the event handlers. The promise will never resolve in this case.

```typescript
import once from '@tootallnate/once';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
const result = await once<string>(emitter, 'foo');
console.log(`got ${result}`);

// ... elsewhere ...
emitter.emit('foo', 'bar');
// "got bar"
```

## once.spread<T>(emitter: EventEmitter, name: string): CancelablePromise<T>

Similar to the main `once()` function, except this version is for the less common
scenario of there being more than one parameter provided to the event handler (for
example, a `ChildProcess` "exit" event is provided with two arguments: `code` and
`signal`).

```typescript
import once from '@tootallnate/once';
import { spawn } from 'child_process';

const child = spawn('ls', [], { stdio: 'inherit' });
const [ code, signal ] = await once.spread<[number, string | null]>(child, 'exit');
console.log(`child process exited with code=${code}, signal=${signal}`);
```
