import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import once from '../src';

describe('once()', () => {
    it('should work with vanilla EventEmitter', async () => {
        const emitter = new EventEmitter();
        const promise = once(emitter, 'foo');
        emitter.emit('foo', 'bar');
        const [ foo ] = await promise;
        expect(foo).toEqual('bar');
    });

    it('should work with interface extending from EventEmitter with overload', async () => {
        interface TestEmitter extends EventEmitter {
            on(name: 'foo', listener: (a: string, b: number) => void): this;
        }

        const emitter: TestEmitter = new EventEmitter();
        const promise = once(emitter, 'foo');
        emitter.emit('foo', 'bar', 4);
        const [ a, b ] = await promise;
        expect(a).toEqual('bar');
        expect(b).toEqual(4);
    });

    it('should work with ChildProcess "exit" event', async () => {
        const child = spawn('echo', ['hi']);
        const [ code, signal ] = await once(child, 'exit');
        expect(code).toEqual(0)
        expect(signal).toBeNull();
    });
});
