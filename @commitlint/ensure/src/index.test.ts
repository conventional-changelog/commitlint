import path from 'path';
import glob from 'glob';
import camelCase from 'lodash/camelcase';
import * as ensure from '.';

test('exports all checkers', async () => {
	const ignore = ['types'];
	const expected = _glob('*.ts')
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

function _glob(pattern: string): string[] {
	const files = glob.sync(pattern, {
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
