import { spawn } from 'child_process';
import once from '../src';

describe('once()', () => {
    it('should work with ChildProcess "exit" event', async () => {
        const child = spawn('echo', ['hi']);
        const [ code, signal ] = await once(child, 'exit');
        expect(code).toEqual(0)
        expect(signal).toBeNull();
    });
});
