# @tootallnate/once

### Creates a Promise that waits for a single event

## Installation

Install with `npm`:

```bash
$ npm install @tootallnate/once
```

## API

### once(emitter: EventEmitter, name: string, opts?: OnceOptions): Promise&lt;[...Args]&gt;

Creates a promise that waits for event name `name` to occur and resolves the
promise with an arrayy of the values provided to the event handler. If an
`error` event occurs before the event specified by `name`, then the promise is
rejected with the error argument.

```typescript
import once from '@tootallnate/once';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

setTimeout(() => {
	emitter.emit('foo', 'bar');
}, 100);

const [result] = await once(emitter, 'foo');
console.log(`got ${result}`);
// "got bar"
```

### OnceOptions

-   `signal` - `AbortSignal` from https://npmjs.com/abort-controller
