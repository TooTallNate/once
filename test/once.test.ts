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
		expect(a).toEqual('bar');
	});

	it('should work with ChildProcess "exit" event', async () => {
		const child = spawn('echo', ['hi']);
		const [code, signal] = await once(child, 'exit');
		expect(code).toEqual(0);
		expect(signal).toBeNull();
	});

	it('should be abortable with `AbortController`', async () => {
		const emitter = new EventEmitter();
		const controller = new AbortController();
		const { signal } = controller;
		const promise = once(emitter, 'foo', { signal });
		emitter.emit('foo', 'bar');
		const [foo] = await promise;
		expect(foo).toEqual('bar');
	});
});
