import path from "node:path";

import configAngular from "@commitlint/config-angular";
import { glob } from "node:fs/promises";
import mergeWith from "lodash.mergewith";

function pathToId(root, filePath) {
	const relativePath = path.relative(root, filePath);
	return path.dirname(relativePath).split(path.sep).join("/");
}

async function getPatternIDs() {
	const root = path.resolve(process.cwd(), "./patterns");
	const pattern = path.resolve(root, "**/pattern.json");
	const files = [];
	for await (const result of glob(pattern)) {
		files.push(pathToId(root, result));
	}
	return files;
}

export default mergeWith(configAngular, {
	rules: {
		"scope-enum": () =>
			getPatternIDs().then((ids) => [2, "always", ids.concat(["system"])]),
	},
});
