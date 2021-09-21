import { EventEmitter } from 'events';
import {
	EventNames,
	EventListenerParameters,
	CancelablePromise,
	CancelFunction,
} from './types';

export default function once<
	Emitter extends EventEmitter,
	Event extends EventNames<Emitter>
>(
	emitter: Emitter,
	name: Event
): CancelablePromise<EventListenerParameters<Emitter, Event>> {
	let c!: CancelFunction;
	const p = new Promise<EventListenerParameters<Emitter, Event>>(
		(resolve, reject) => {
			let canceled = false;
			function cancel() {
				if (canceled) return;
				canceled = true;
				emitter.removeListener(name, onEvent);
				emitter.removeListener('error', onError);
			}
			function onEvent(...args: any[]) {
				p.cancel();
				resolve(args as EventListenerParameters<Emitter, Event>);
			}
			function onError(err: Error) {
				p.cancel();
				reject(err);
			}
			c = cancel;
			emitter.on(name, onEvent);
			emitter.on('error', onError);
		}
	) as CancelablePromise<EventListenerParameters<Emitter, Event>>;
	p.cancel = c;
	return p;
}
