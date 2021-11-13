#!/usr/bin/env node
const execa = require('execa');
const inquirer = require('inquirer');
const {prompter} = require('@commitlint/prompt');

main().catch((err) => {
	setTimeout(() => {
		throw err;
	});
});

function main() {
	return isStageEmpty()
		.then((empty) => {
			if (empty) {
				console.log(
					`Nothing to commit. Stage your changes via "git add" execute "commit" again`
				);
				process.exit(1);
			}
		})
		.then(() => prompter(inquirer, commit));
}

function isStageEmpty() {
	return execa('git', ['diff', '--cached']).then((r) => r.stdout === '');
}

function commit(message) {
	const c = execa('git', ['commit', '-m', message]);
	c.stdout.pipe(process.stdout);
	c.stderr.pipe(process.stderr);
}
