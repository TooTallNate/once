# @tootallnate/once

### Creates a Promise that waits for a single event

## Installation

Install with `npm`:

```bash
$ npm install @tootallnate/once
```

## API

### once(emitter: EventEmitter, name: string, opts?: OnceOptions): Promise&lt;[...Args]&gt;

Creates a Promise that waits for event `name` to occur on `emitter`, and resolves
the promise with an array of the values provided to the event handler. If an
`error` event occurs before the event specified by `name`, then the Promise is
rejected with the error argument.

```typescript
import once from '@tootallnate/once';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

setTimeout(() => {
    emitter.emit('foo', 'bar');
}, 100);

const [result] = await once(emitter, 'foo');
console.log({ result });
// { result: 'bar' }
```

#### Promise Strong Typing

The main feature that this module provides over other "once" implementations is that
the Promise that is returned is _**strongly typed**_ based on the type of `emitter`
and the `name` of the event. Some examples are shown below.

_The process "exit" event contains a single number for exit code:_

```typescript
const [code] = await once(process, 'exit');
//     ^ number
```
_A child process "exit" event contains either an exit code or a signal:_

```typescript
const child = spawn('echo', []);
const [code, signal] = await once(child, 'exit');
//     ^ number | null
//           ^ string | null
```

_A forked child process "message" event is type `any`, so you can cast the Promise directly:_

```typescript
const child = fork('file.js');
const [code, signal]:  = await once(child, 'message');
```

_If the TypeScript definition does not contain an overload for the specified event name, then the Promise will have type `unknown[]` and your code will need to narrow the result manually:_

```typescript
interface CustomEmitter extends EventEmitter {
    on(name: 'foo', listener: (a: string, b: number) => void): this;
}

const emitter: CustomEmitter = new EventEmitter();

const fooPromise = once(emitter, 'foo');
//    ^ Promise<[a: string, b: number]>

const barPromise = once(emitter, 'bar');
//    ^ Promise<unknown[]>
```

### OnceOptions

-   `signal` - `AbortSignal` instance to unbind event handlers before the Promise has been fulfilled.
