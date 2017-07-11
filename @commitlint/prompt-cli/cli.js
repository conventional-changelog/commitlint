#!/usr/bin/env node
const execa = require('execa');
const meow = require('meow');
const prompter = require('@commitlint/prompt').prompter;

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
	return prompt();
}

function commit(message) {
	const c = execa('git', ['commit', '-m', message]);
	c.stdout.pipe(process.stdout);
	c.stderr.pipe(process.stderr);
}
