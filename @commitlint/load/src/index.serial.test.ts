import * as path from 'path';
import load from '.';

const {fix} = require('@commitlint/test');

const fixture = (name: string) => path.resolve(__dirname, '../fixtures', name);

test('default cwd option to process.cwd()', async () => {
	const cwd = await fix.bootstrap(fixture('basic'));
	const before = process.cwd();
	process.chdir(cwd);

	try {
		const actual = await load();
		expect(actual.rules['body-case']).toBeTruthy();
	} catch (err) {
		throw err;
	} finally {
		process.chdir(before);
	}
});
