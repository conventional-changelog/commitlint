#!/usr/bin/env node
import path from 'path';
import execa from 'execa';

const cwd = process.cwd();

function main() {
	return Promise.all([
		check(['--missing', '--no-dev', '.']),
		check(['--extra', '--no-dev', '.']),
	])
		.then((tasks) => [null, tasks.map((t) => t.stdout).join('\n')])
		.catch((err) => [err]);
}

function check(args) {
	return execa('dependency-check', args, {cwd});
}

main().then((args) => {
	const err = args[0];
	const out = args[1];
	console.log(`Checking dependencies ${path.join(cwd, 'package.json')}`);
	if (err) {
		console.error(err.stderr);
		process.exit(err.exitCode);
	}
	if (out) {
		console.log(out);
		process.exit(0);
	}
});
