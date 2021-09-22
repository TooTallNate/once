import { EventEmitter } from 'events';
import { AbortController, EventNames, EventListenerParameters } from './types';

export interface OnceOptions {
	abort?: AbortController;
}

export default function once<
	Emitter extends EventEmitter,
	Event extends EventNames<Emitter>
>(
	emitter: Emitter,
	name: Event,
	{ abort }: OnceOptions = {}
): Promise<EventListenerParameters<Emitter, Event>> {
	return new Promise((resolve, reject) => {
		function cleanup() {
			abort?.signal.removeEventListener('abort', cleanup);
			emitter.removeListener(name, onEvent);
			emitter.removeListener('error', onError);
		}
		function onEvent(...args: any[]) {
			cleanup();
			resolve(args as EventListenerParameters<Emitter, Event>);
		}
		function onError(err: Error) {
			cleanup();
			reject(err);
		}
		abort?.signal.addEventListener('abort', cleanup);
		emitter.on(name, onEvent);
		emitter.on('error', onError);
	});
}
