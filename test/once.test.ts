import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { AbortController } from 'abort-controller';
import once from '../src';

describe('once()', () => {
	it('should work with vanilla EventEmitter', async () => {
		const emitter = new EventEmitter();
		const promise = once(emitter, 'foo');
		emitter.emit('foo', 'bar');
		const [foo] = await promise;
		expect(foo).toEqual('bar');
	});

	it('should work with vanilla EventEmitter - nextTick', async () => {
		const ee = new EventEmitter();
		process.nextTick(() => {
			ee.emit('myevent', 42);
		});
		const [value] = await once(ee, 'myevent');
		expect(value).toEqual(42);
	});

	it('should reject Promise upon "error" event', async () => {
		let err: Error | null = null;
		const emitter = new EventEmitter();
		const promise = once(emitter, 'foo').catch((_err) => {
			err = _err;
		});
		emitter.emit('error', new Error('test'));
		await promise;
		expect(err!.message).toEqual('test');
	});

	it('should reject Promise upon "error" event - nextTick', async () => {
		const ee = new EventEmitter();

		const err = new Error('kaboom');
		process.nextTick(() => {
			ee.emit('error', err);
		});

		try {
			await once(ee, 'myevent');
			throw new Error('Should not happen');
		} catch (err: any) {
			expect(err.message).toEqual('kaboom');
		}
	});

	it('should work with interface extending EventEmitter with overload', async () => {
		interface TestEmitter extends EventEmitter {
			on(name: 'foo', listener: (a: string, b: number) => void): this;
		}

		const emitter: TestEmitter = new EventEmitter();
		const promise = once(emitter, 'foo');
		emitter.emit('foo', 'bar', 4);
		const [a, b] = await promise;
		expect(a).toEqual('bar');
		expect(b).toEqual(4);
	});

	it('should allow casting from an `any` param', async () => {
		interface TestEmitter extends EventEmitter {
			on(name: 'foo', listener: (a: any, b: number) => void): this;
		}

		const emitter: TestEmitter = new EventEmitter();
		const promise: Promise<[string, unknown]> = once(emitter, 'foo');
		emitter.emit('foo', 'bar', 4);
		const [a] = await promise;
		// TypeScript will fail if `a` is not `string` type
		expect(a.toUpperCase()).toEqual('BAR');
	});

	it('should work with ChildProcess "exit" event', async () => {
		const child = spawn('echo', ['hi']);
		const [code, signal] = await once(child, 'exit');
		expect(code).toEqual(0);
		expect(signal).toBeNull();
	});

	it('should be abortable with `AbortController`', async () => {
		let wasResolved = false;
		const emitter = new EventEmitter();
		const controller = new AbortController();
		const { signal } = controller;

		const onResolve = () => {
			wasResolved = true;
		};
		once(emitter, 'foo', { signal }).then(onResolve, onResolve);

		// First time without `abort()`, so it will be fulfilled
		emitter.emit('foo');

		// Promise is fulfilled on next tick, so wait a bit
		await new Promise((r) => process.nextTick(r));

		expect(wasResolved).toEqual(true);

		// Reset
		wasResolved = false;

		once(emitter, 'foo', { signal }).then(onResolve, onResolve);

		// This time abort
		controller.abort();
		emitter.emit('foo');

		// Promise is fulfilled on next tick, so wait a bit
		await new Promise((r) => process.nextTick(r));

		expect(wasResolved).toEqual(false);
	});
});
