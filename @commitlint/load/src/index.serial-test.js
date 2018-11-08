import {fix} from '@commitlint/test';
import test from 'ava';

import load from '.';

test.serial('default cwd option to process.cwd()', async t => {
	const cwd = await fix.bootstrap('fixtures/basic');
	const before = process.cwd();
	process.chdir(cwd);

	try {
		const actual = await load();
		t.true(actual.rules.basic);
	} catch (err) {
		throw err;
	} finally {
		process.chdir(before);
	}
});
