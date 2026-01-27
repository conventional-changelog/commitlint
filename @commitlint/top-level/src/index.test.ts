import { test, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

import { fix, git } from "@commitlint/test";
import topLevel from "./index.js";

test("find .git in normal repository as directory", async () => {
	const temp = await git.bootstrap();
	const cwd = path.join(temp, "src", "shared");
	await fs.mkdir(cwd, { recursive: true });

	const top = (await topLevel(cwd)) as string;
	expect(top).toEqual(temp);
	expect((await fs.stat(path.join(top, ".git"))).isDirectory()).toEqual(true);
});

test("find .git in submodule repository as file", async () => {
	const temp = await git.bootstrap();
	const root = path.join(temp, "parser");
	const cwd = path.join(root, "src");
	await fs.mkdir(cwd, { recursive: true });
	await fs.writeFile(path.join(root, ".git"), "");

	const top = (await topLevel(cwd)) as string;
	expect(top).toEqual(root);
	expect((await fs.stat(path.join(top, ".git"))).isFile()).toEqual(true);
});

test("not found in non-git folder", async () => {
	const temp = await fix.bootstrap();
	const cwd = path.join(temp, "src", "shared");
	await fs.mkdir(cwd, { recursive: true });

	const top = (await topLevel(cwd)) as undefined;
	expect(top).toEqual(undefined);
});
