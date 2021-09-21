import { EventEmitter } from 'events';
import { OverloadedParameters } from './overloaded-parameters';

export type FirstParameter<T> = T extends [infer R, ...any[]] ? R : never;

export type EventListener<F, T extends string | symbol> = F extends [
	T,
	infer R,
	...any[]
]
	? R
	: never;

export type EventParameters<
	Emitter extends EventEmitter
> = OverloadedParameters<Emitter['on']>;

export type EventNames<Emitter extends EventEmitter> = FirstParameter<
	EventParameters<Emitter>
>;

export type EventListenerParameters<
	Emitter extends EventEmitter,
	Event extends EventNames<Emitter>
> = WithDefault<Parameters<EventListener<EventParameters<Emitter>, Event>>>;

export interface CancelFunction {
	(): void;
}

export interface CancelablePromise<T> extends Promise<T> {
	cancel: CancelFunction;
}

export type WithDefault<T> = [T] extends [never] ? any[] : T;
