import { EventEmitter } from 'events';
import { EventNames, EventListenerParameters, AbortSignal } from './types.js';

export interface OnceOptions {
	signal?: AbortSignal;
}

export default function once<
	Emitter extends EventEmitter,
	Event extends EventNames<Emitter>
>(
	emitter: Emitter,
	name: Event,
	{ signal }: OnceOptions = {}
): Promise<EventListenerParameters<Emitter, Event>> {
	return new Promise((resolve, reject) => {
		function cleanup() {
			signal?.removeEventListener('abort', cleanup);
			emitter.removeListener(name, onEvent);
			emitter.removeListener('error', onError);
		}
		function onEvent(...args: EventListenerParameters<Emitter, Event>) {
			cleanup();
			resolve(args);
		}
		function onError(err: Error) {
			cleanup();
			reject(err);
		}
		signal?.addEventListener('abort', cleanup);
		emitter.on(name, onEvent);
		emitter.on('error', onError);
	});
}
