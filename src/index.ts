import { EventEmitter } from 'events';

function once<T>(
	emitter: EventEmitter,
	name: string
): once.CancellablePromise<T> {
	let c: once.CancelFunction | null = null;
	const p = new Promise<T>((resolve, reject) => {
		function cancel() {
			emitter.removeListener(name, onEvent);
			emitter.removeListener('error', onError);
		}
		function onEvent(arg: T) {
			cancel();
			resolve(arg);
		}
		function onError(err: Error) {
			cancel();
			reject(err);
		}
		c = cancel;
		emitter.on(name, onEvent);
		emitter.on('error', onError);
	}) as once.CancellablePromise<T>;
	if (!c) {
		throw new TypeError('Could not get `cancel()` function');
	}
	p.cancel = c;
	return p;
}

namespace once {
	export interface CancelFunction {
		(): void;
	}
	export interface CancellablePromise<T> extends Promise<T> {
		cancel: CancelFunction;
	}
}

export = once;
