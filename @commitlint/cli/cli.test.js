import path from 'path';
import test from 'ava';
import execa from 'execa';
import {includes} from 'lodash';
import {sync as bin} from 'resolve-bin';
import * as sander from 'sander';
import stream from 'string-to-stream';
import tmp from 'tmp';

const here = path.join.bind(null, __dirname);
const fix = here.bind(null, 'fixtures');

const CLI = here('cli.js');
const SIMPLE = fix('simple');
const EXTENDS_ROOT = fix('extends-root');
const EMPTY = fix('empty');
const PARSER_PRESET = fix('parser-preset');

const HUSKY = tmp.dirSync().name;
const HUSKY_INTEGRATION = path.join(tmp.dirSync().name, 'integration');

const exec = (command, args = [], opts = {}) => {
	return async (input = '') => {
		const c = execa(command, args, {
			capture: ['stdout'],
			cwd: opts.cwd
		});
		stream(input).pipe(c.stdin);
		const result = await c;
		if (result.code !== 0) {
			console.log(result.stderr);
		}
		return result;
	}
};

const cli = exec.bind(null, CLI);
const git = exec.bind(null, 'git');
const mkdir = exec.bind(null, bin('mkdirp'));
const npm = exec.bind(null, 'npm');
const rm = exec.bind(null, bin('rimraf'));

test('should throw when called without [input]', t => {
	t.throws(cli()(), /Expected a raw commit/);
});

test('should reprint input from stdin', async t => {
	const actual = await cli([], {cwd: EMPTY})('foo: bar');
	t.true(includes(actual.stdout, 'foo: bar'));
});

test('should produce no success output with --quiet flag', async t => {
	const actual = await cli(['--quiet'], {cwd: EMPTY})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should produce no success output with -q flag', async t => {
	const actual = await cli(['-q'], {cwd: EMPTY})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should succeed for input from stdin without rules', async t => {
	const actual = await cli([], {cwd: EMPTY})('foo: bar');
	t.is(actual.code, 0);
});

test('should fail for input from stdin with rule from rc', async t => {
	const actual = await t.throws(cli([], {cwd: SIMPLE})('foo: bar'));
	t.true(includes(actual.stdout, 'type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should fail for input from stdin with rule from js', async t => {
	const actual = await t.throws(
		cli(['--extends', './extended'], {cwd: EXTENDS_ROOT})('foo: bar')
	);
	t.true(includes(actual.stdout, 'type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should produce no error output with --quiet flag', async t => {
	const actual = await t.throws(cli(['--quiet'], {cwd: SIMPLE})('foo: bar'));
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
	t.is(actual.code, 1);
});

test('should produce no error output with -q flag', async t => {
	const actual = await t.throws(cli(['-q'], {cwd: SIMPLE})('foo: bar'));
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
	t.is(actual.code, 1);
});

test('should work with husky commitmsg hook', async () => {
	const cwd = HUSKY;

	await init(cwd);
	await pkg(cwd);

	await npm(['install', 'husky'], {cwd})();
	await git(['add', 'package.json'], {cwd})();
	await git(['commit', '-m', '"chore: this should work"'], {cwd})();

	await rm([HUSKY])();
});

test('should work with husky commitmsg hook in sub packages', async () => {
	const cwd = HUSKY_INTEGRATION;
	const upper = path.dirname(HUSKY_INTEGRATION);

	await mkdir([cwd])();
	await init(upper);
	await pkg(cwd);

	await npm(['install', 'husky'], {cwd})();
	await git(['add', 'package.json'], {cwd})();

	await git(['commit', '-m', '"chore: this should work"'], {cwd})();

	await rm([upper])();
});

test('should pick up parser preset', async t => {
	const cwd = PARSER_PRESET;

	const actual = await t.throws(cli([], {cwd})('type(scope)-ticket subject'));
	t.true(includes(actual.stdout, 'message may not be empty [subject-empty]'));

	await cli(['--parser-preset', './parser-preset'], {cwd})('type(scope)-ticket subject');
});

async function init(cwd) {
	await git(['init'], {cwd})();

	return Promise.all([
		git(['config', 'user.email', '"commitlint@gitub.com"'], {cwd})(),
		git(['config', 'user.name', '"commitlint"'], {cwd})()
	]);
}

function pkg(cwd) {
	return sander.writeFile(cwd, 'package.json', JSON.stringify({scripts: {commitmsg: `${CLI} -e`}}));
}
