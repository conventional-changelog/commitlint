#!/usr/bin/env node
const execa = require('execa');
const meow = require('meow');
const {prompter} = require('@commitlint/prompt');

const HELP = `
	Usage
		$ commit
`;

const _ = undefined;
const prompt = () => prompter(_, commit);

main(meow(HELP)).catch(err => {
	setTimeout(() => {
		throw err;
	});
});

function main() {
	return isStageEmpty()
		.then(empty => {
			if (empty) {
				console.log(
					`Nothing to commit. Stage your changes via "git add" execute "commit" again`
				);
				process.exit(1);
			}
		})
		.then(() => prompt());
}

function isStageEmpty() {
	return execa('git', ['diff', '--cached']).then(r => r.stdout === '');
}

function commit(message) {
	const c = execa('git', ['commit', '-m', message]);
	c.stdout.pipe(process.stdout);
	c.stderr.pipe(process.stderr);
}
