/**
 * This script generated a TypeScript file that defines
 * a type based on this StackOverflow answer:
 * https://stackoverflow.com/a/52761156/376773
 */

process.stdout.write('export type OverloadedParameters<T> = \n');

const overloads = parseInt(process.argv[2], 10) || 5;

for (let i = overloads; i > 0; i--) {
	process.stdout.write(`T extends { `);
	for (let j = 0; j < i; j++) {
		process.stdout.write(
			`(...args: infer A${String(j).padStart(2, '0')}): any; `
		);
	}
	process.stdout.write(`} ? `);
	for (let j = 0; j < i; j++) {
		process.stdout.write(`A${String(j).padStart(2, '0')} `);
		if (j < i - 1) {
			process.stdout.write(`| `);
		}
	}
	process.stdout.write(`:\n`);
}

process.stdout.write(`any\n`);
