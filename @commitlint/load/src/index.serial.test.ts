import * as path from 'path';
import {fix} from '@commitlint/test';
import load from '.';

const fixBootstrap = (name: string) => fix.bootstrap(name, __dirname);

test('default cwd option to process.cwd()', async () => {
	const cwd = await fixBootstrap('fixtures/basic');
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
