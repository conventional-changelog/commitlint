#!/usr/bin/env node
import {prompter} from '@commitlint/prompt';
import inquirer from 'inquirer';
import {x} from 'tinyexec';

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
	return x('git', ['diff', '--cached']).then((r) => r.stdout === '');
}

function commit(message) {
	const result = x('git', ['commit', '-m', message]);
	result.process.stdout.pipe(process.stdout);
	result.process.stderr.pipe(process.stderr);
}
