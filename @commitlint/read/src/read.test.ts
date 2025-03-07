import { test, expect } from "vitest";
import fs from "fs/promises";
import path from "node:path";
import { git } from "@commitlint/test";
import { x } from "tinyexec";

import read from "./read.js";

test("get edit commit message specified by the `edit` flag", async () => {
	const cwd: string = await git.bootstrap();

	await fs.writeFile(path.join(cwd, "commit-msg-file"), "foo");

	const expected = ["foo\n"];
	const actual = await read({ edit: "commit-msg-file", cwd });
	expect(actual).toEqual(expected);
});

test("get edit commit message from git root", async () => {
	const cwd: string = await git.bootstrap();

	await fs.writeFile(path.join(cwd, "alpha.txt"), "alpha");
	await x("git", ["add", "."], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "alpha"], { nodeOptions: { cwd } });
	const expected = ["alpha\n\n"];
	const actual = await read({ edit: true, cwd });
	expect(actual).toEqual(expected);
});

test("get history commit messages", async () => {
	const cwd: string = await git.bootstrap();
	await fs.writeFile(path.join(cwd, "alpha.txt"), "alpha");
	await x("git", ["add", "alpha.txt"], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "alpha"], { nodeOptions: { cwd } });
	await x("git", ["rm", "alpha.txt"], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "remove alpha"], { nodeOptions: { cwd } });

	const expected = ["remove alpha\n\n", "alpha\n\n"];
	const actual = await read({ cwd });
	expect(actual).toEqual(expected);
});

test("get edit commit message from git subdirectory", async () => {
	const cwd: string = await git.bootstrap();
	await fs.mkdir(path.join(cwd, "beta"));
	await fs.writeFile(path.join(cwd, "beta/beta.txt"), "beta");

	await x("git", ["add", "."], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "beta"], { nodeOptions: { cwd } });

	const expected = ["beta\n\n"];
	const actual = await read({ edit: true, cwd });
	expect(actual).toEqual(expected);
});

test("get edit commit message while skipping first commit", async () => {
	const cwd: string = await git.bootstrap();
	await fs.mkdir(path.join(cwd, "beta"));
	await fs.writeFile(path.join(cwd, "beta/beta.txt"), "beta");

	await fs.writeFile(path.join(cwd, "alpha.txt"), "alpha");
	await x("git", ["add", "alpha.txt"], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "alpha"], { nodeOptions: { cwd } });
	await fs.writeFile(path.join(cwd, "beta.txt"), "beta");
	await x("git", ["add", "beta.txt"], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "beta"], { nodeOptions: { cwd } });
	await fs.writeFile(path.join(cwd, "gamma.txt"), "gamma");
	await x("git", ["add", "gamma.txt"], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", "gamma"], { nodeOptions: { cwd } });

	const expected = ["beta\n\n"];
	const actual = await read({ from: "HEAD~2", cwd, gitLogArgs: "--skip 1" });
	expect(actual).toEqual(expected);
});

test("should only read the last commit", async () => {
	const cwd: string = await git.bootstrap();

	await x("git", ["commit", "--allow-empty", "-m", "commit Z"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit Y"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit X"], {
		nodeOptions: { cwd },
	});

	const result = await read({ cwd, last: true });

	expect(result).toEqual(["commit X"]);
});

test("should read commits from the last annotated tag", async () => {
	const cwd: string = await git.bootstrap();

	await x("git", ["commit", "--allow-empty", "-m", "chore: release v1.0.0"], {
		nodeOptions: { cwd },
	});
	await x("git", ["tag", "v1.0.0", "--annotate", "-m", "v1.0.0"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit 1"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit 2"], {
		nodeOptions: { cwd },
	});

	const result = await read({ cwd, fromLastTag: true });

	expect(result).toEqual(["commit 2\n\n", "commit 1\n\n"]);
});

test("should read commits from the last lightweight tag", async () => {
	const cwd: string = await git.bootstrap();

	await x(
		"git",
		["commit", "--allow-empty", "-m", "chore: release v9.9.9-alpha.1"],
		{ nodeOptions: { cwd } },
	);
	await x("git", ["tag", "v9.9.9-alpha.1"], { nodeOptions: { cwd } });
	await x("git", ["commit", "--allow-empty", "-m", "commit A"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit B"], {
		nodeOptions: { cwd },
	});

	const result = await read({ cwd, fromLastTag: true });

	expect(result).toEqual(["commit B\n\n", "commit A\n\n"]);
});

test("should not read any commits when there are no tags", async () => {
	const cwd: string = await git.bootstrap();

	await x("git", ["commit", "--allow-empty", "-m", "commit 7"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit 8"], {
		nodeOptions: { cwd },
	});
	await x("git", ["commit", "--allow-empty", "-m", "commit 9"], {
		nodeOptions: { cwd },
	});

	const result = await read({ cwd, fromLastTag: true });

	expect(result).toHaveLength(0);
});
