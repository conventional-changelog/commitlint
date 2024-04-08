import {test, expect} from 'vitest';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {globSync} from 'glob';

import rules from './index.js';

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..');

test('exports all rules', () => {
	const expected = _glob('*.ts').sort();
	const actual = Object.keys(rules).sort();
	expect(actual).toEqual(expected);
});

test('rules export functions', () => {
	const actual = Object.values(rules);
	expect(actual.every((rule) => typeof rule === 'function')).toBe(true);
});

test('all rules are present in documentation', () => {
	const file = fs.readFileSync(
		path.join(__dirname, '../../../docs/reference/rules.md'),
		'utf-8'
	);
	const results = file
		.split(/(\n|\r)/)
		.filter((s) => s.startsWith('##') && !s.includes('`deprecated`'))
		.map((s) => s.replace('## ', ''));

	expect(Object.keys(rules)).toEqual(expect.arrayContaining(results));
});

function _glob(pattern: string) {
	const files = globSync(pattern, {
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
