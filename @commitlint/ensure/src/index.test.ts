import path from 'path';
import globby from 'globby';
import camelCase from 'lodash.camelcase';
import * as ensure from '.';

test('exports all checkers', async () => {
	const ignore = ['types'];
	const expected = (await glob('*.ts'))
		.map((f) => camelCase(f))
		.sort()
		.filter((item) => !ignore.includes(item));
	const actual = Object.keys(ensure).sort();
	expect(actual).toEqual(expected);
});

test('rules export functions', () => {
	const actual = Object.values(ensure);
	expect(actual.every((rule) => typeof rule === 'function')).toBe(true);
});

async function glob(pattern: string): Promise<string[]> {
	const files = await globby(pattern, {
		ignore: ['**/index.ts', '**/*.test.ts'],
		cwd: __dirname,
	});
	return files.map(relative).map(toExport);
}

function relative(filePath: string): string {
	return path.relative(__dirname, filePath);
}

function toExport(fileName: string): string {
	return path.basename(fileName, path.extname(fileName));
}
