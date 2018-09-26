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

// Test.serial('empty cwd option to process.cwd() should throw error message', async t => {
// 	const cwd = await fix.bootstrap('fixtures/empty-file');
// 	const before = process.cwd();
// 	process.chdir(cwd);

// 	try {
// 		const actual = await load();
// 	} catch (err) {
// 		console.log('-------------------------')
// 		// t.true(err.includes('OTTO'));
// 		// throw err;
// 	} finally {
// 		process.chdir(before);
// 	}
// });
