import * as u from '.';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';

test('exports a git namespace', () => {
	expect(typeof u.git).toBe('object');
});

test('git namespace has bootstrap', () => {
	expect(typeof u.git.bootstrap).toBe('function');
});

test('git namespace has clone', () => {
	expect(typeof u.git.clone).toBe('function');
});

test('expect to create tmp directory', async () => {
	const directory = await u.git.bootstrap();
	expect(directory).toContain('tmp-');
	expect(directory).toContain(os.tmpdir());
});

test('expect to create tmp from directory from src', async () => {
	const directory = await u.git.bootstrap('.github');
	expect(directory).toContain('tmp-');
	expect(directory).toContain(os.tmpdir());

	const indexFile = path.join(directory, 'ISSUE_TEMPLATE.md');
	expect(fs.existsSync(indexFile)).toBeTruthy();

	expect(fs.existsSync(directory)).toBeFalsy();
});
