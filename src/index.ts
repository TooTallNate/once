import { EventEmitter } from 'events';

function noop() {}

function once<T>(
	emitter: EventEmitter,
	name: string
): once.CancelablePromise<T> {
	const o = once.spread<[T]>(emitter, name);
	const r = o.then((args: [T]) => args[0]) as once.CancelablePromise<T>;
	r.cancel = o.cancel;
	return r;
}

namespace once {
	export interface CancelFunction {
		(): void;
	}

	export interface CancelablePromise<T> extends Promise<T> {
		cancel: CancelFunction;
	}

	export type CancellablePromise<T> = CancelablePromise<T>;

	export function spread<T extends any[]>(
		emitter: EventEmitter,
		name: string
	): once.CancelablePromise<T> {
		let c: once.CancelFunction | null = null;
		const p = new Promise<T>((resolve, reject) => {
			function cancel() {
				emitter.removeListener(name, onEvent);
				emitter.removeListener('error', onError);
				p.cancel = noop;
			}
			function onEvent(...args: any[]) {
				cancel();
				resolve(args as T);
			}
			function onError(err: Error) {
				cancel();
				reject(err);
			}
			c = cancel;
			emitter.on(name, onEvent);
			emitter.on('error', onError);
		}) as once.CancelablePromise<T>;
		if (!c) {
			throw new TypeError('Could not get `cancel()` function');
		}
		p.cancel = c;
		return p;
	}
}

export = once;
