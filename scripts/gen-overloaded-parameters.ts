/**
 * This script generated a TypeScript file that defines
 * a type based on this StackOverflow answer:
 * https://stackoverflow.com/a/52761156/376773
 */

process.stdout.write('export type OverloadedParameters<T> = \n');

const overloads = parseInt(process.argv[2], 10) || 5;

for (let i = overloads; i > 0; i--) {
	process.stdout.write(`\tT extends { `);
	for (let j = 1; j <= i; j++) {
		process.stdout.write(
			`(...args: infer A${j}): any; `
		);
	}
	process.stdout.write(`} ? `);
	for (let j = 1; j <= i; j++) {
		process.stdout.write(`A${j} `);
		if (j < i) {
			process.stdout.write(`| `);
		}
	}
	process.stdout.write(`:\n`);
}

process.stdout.write(`\tany;\n`);
