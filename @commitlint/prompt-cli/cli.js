#!/usr/bin/env node
import { parseArgs } from "node:util";

import { prompter } from "@commitlint/prompt";
import inquirer from "inquirer";
import { x } from "tinyexec";

main().catch((err) => {
	setTimeout(() => {
		throw err;
	});
});

function main() {
	const { values: flags } = parseArgs({
		options: {
			config: { type: "string", short: "g" },
		},
		strict: false,
	});
	const file = typeof flags.config === "string" ? flags.config : undefined;

	return isStageEmpty()
		.then((empty) => {
			if (empty) {
				console.log(`Nothing to commit. Stage your changes via "git add" execute "commit" again`);
				process.exit(1);
			}
		})
		.then(() => prompter(inquirer, commit, { file }));
}

function isStageEmpty() {
	return x("git", ["diff", "--cached"]).then((r) => r.stdout === "");
}

function commit(message) {
	const result = x("git", ["commit", "-m", message]);
	result.process.stdout.pipe(process.stdout);
	result.process.stderr.pipe(process.stderr);
}
