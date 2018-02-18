#!/usr/bin/env node
const path = require('path');
const {git} = require('@commitlint/test');
const execa = require('execa');
const meow = require('meow');

const SCRIPT = path.join(__dirname, 'cast.sh');
const SOURCE = path.join(__dirname, 'cwd');

main(
	meow(`
  Options
	--out   Output file to write in

  Example
	commitlint-svg --out docs/assets/commitlint.svg
`)
).catch(err => {
	if (err.help) {
		console.error(err.help());
		console.error(err.message);
		process.exit(1);
	} else {
		throw err;
	}
});

async function main(cli) {
	const cwd = await git.bootstrap(SOURCE);
	const out = cli.flags.out ? path.resolve(process.cwd(), cli.flags.out) : null;

	await execa(
		'svg-term',
		[
			'--command',
			`sh ${SCRIPT}`,
			'--out',
			out,
			'--window',
			'--width',
			100,
			'--padding-y',
			10
		],
		{cwd}
	);
}
