import {tmpdir} from 'os';
import crypto from 'crypto';
import path from 'path';
import test from 'ava';
import exists from 'path-exists';
import execa from 'execa';
import * as sander from '@marionebl/sander';

import load from './load';

test.beforeEach(async t => {
	t.context.repo = await initRepository();
});

test.afterEach.always(async t => {
	await cleanRepository(t.context.repo);
});

test.serial('extends-empty should have no rules', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/extends-empty'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual.rules, {});
});

test.serial('uses seed as configured', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/extends-empty'))
		.to(repo.directory);

	const actual = await load({rules: {foo: 'bar'}});
	t.is(actual.rules.foo, 'bar');
});

test.serial('uses seed with parserPreset', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/parser-preset'))
		.to(repo.directory);

	const {parserPreset: actual} = await load({
		parserPreset: './conventional-changelog-custom'
	});

	t.is(actual.name, './conventional-changelog-custom');
	t.deepEqual(actual.opts, {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
		}
	});
});

test.serial('invalid extend should throw', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/extends-invalid'))
		.to(repo.directory);

	await t.throws(load());
});

test.serial('empty file should have no rules', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/empty-object-file'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual.rules, {});
});

test.serial('empty file should extend nothing', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/empty-file'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual.extends, []);
});

test.serial('recursive extends', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/recursive-extends'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test.serial('recursive extends with json file', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/recursive-extends-json'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test.serial('recursive extends with yaml file', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/recursive-extends-yaml'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test.serial('recursive extends with js file', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/recursive-extends-js'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test.serial('recursive extends with package.json file', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/recursive-extends-package'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test.serial(
	'parser preset overwrites completely instead of merging',
	async t => {
		const {repo} = t.context;

		await sander
			.copydir(path.join(repo.previous, 'fixtures/parser-preset-override'))
			.to(repo.directory);
		const actual = await load();

		t.is(actual.parserPreset.name, './custom');
		t.is(typeof actual.parserPreset.opts, 'object');
		t.deepEqual(actual.parserPreset.opts, {
			b: 'b',
			parserOpts: {
				headerPattern: /.*/
			}
		});
	}
);

test.serial('recursive extends with parserPreset', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/recursive-parser-preset'))
		.to(repo.directory);

	await sander
		.copydir(path.join(repo.previous, 'node_modules'))
		.to(path.join('node_modules'));

	const actual = await load();

	t.is(actual.parserPreset.name, './conventional-changelog-custom');
	t.is(typeof actual.parserPreset.opts, 'object');
	t.deepEqual(
		actual.parserPreset.opts.parserOpts.headerPattern,
		/^(\w*)(?:\((.*)\))?-(.*)$/
	);
});

test.serial('ignores unknow keys', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/trash-file'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: [],
		rules: {
			foo: 'bar',
			baz: 'bar'
		}
	});
});

test.serial('ignores unknow keys recursively', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/trash-extend'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./one'],
		rules: {
			zero: 0,
			one: 1
		}
	});
});

test.serial('supports legacy .conventional-changelog-lintrc', async t => {
	const {repo} = t.context;

	await sander
		.copydir(path.join(repo.previous, 'fixtures/legacy'))
		.to(repo.directory);

	const actual = await load();
	t.deepEqual(actual, {
		extends: [],
		rules: {
			legacy: true
		}
	});
});

test.serial(
	'commitlint.config.js overrides .conventional-changelog-lintrc',
	async t => {
		const {repo} = t.context;

		await sander
			.copydir(path.join(repo.previous, 'fixtures/overriden-legacy'))
			.to(repo.directory);

		const actual = await load();
		t.deepEqual(actual, {
			extends: [],
			rules: {
				legacy: false
			}
		});
	}
);

async function initRepository() {
	const previous = process.cwd();
	const directory = path.join(tmpdir(), rand());

	await execa('git', ['init', directory]);

	process.chdir(directory);

	await execa('git', ['config', 'user.email', 'test@example.com']);
	await execa('git', ['config', 'user.name', 'ava']);

	return {directory, previous};
}

async function cleanRepository(repo) {
	if (repo.previous && repo.previous !== process.cwd()) {
		process.chdir(repo.previous);
	}

	if (await exists(repo.directory)) {
		await sander.rimraf(repo.directory);
	}
}

function rand() {
	return crypto
		.randomBytes(Math.ceil(6))
		.toString('hex')
		.slice(0, 12);
}
