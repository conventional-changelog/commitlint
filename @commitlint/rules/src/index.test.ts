import path from 'path';
import fs from 'fs';
import globby from 'globby';
import rules from '.';

test('exports all rules', async () => {
	const expected = (await glob('*.ts')).sort();
	const actual = Object.keys(rules).sort();
	expect(actual).toEqual(expected);
});

test('rules export functions', () => {
	const actual = Object.values(rules);
	expect(actual.every((rule) => typeof rule === 'function')).toBe(true);
});

test('all rules are present in documentation', () => {
	const file = fs.readFileSync(
		path.join(__dirname, '../../../docs/reference-rules.md'),
		'utf-8'
	);
	const results = file
		.split(/(\n|\r)/)
		.filter((s) => s.startsWith('####') && !s.includes('`deprecated`'))
		.map((s) => s.replace('#### ', ''));

	expect(Object.keys(rules)).toEqual(expect.arrayContaining(results));
});

async function glob(pattern: string | string[]) {
	const files = await globby(pattern, {
		ignore: ['**/index.ts', '**/*.test.ts'],
		cwd: __dirname,
	});
	return files.map(relative).map(toExport);
}

function relative(filePath: string) {
	return path.relative(__dirname, filePath);
}

function toExport(fileName: string) {
	return path.basename(fileName, path.extname(fileName));
}
