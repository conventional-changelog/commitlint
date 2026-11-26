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

test("throws an actionable error when --edit is used on a fresh repo without COMMIT_EDITMSG", async () => {
	const cwd: string = await git.bootstrap();

	await expect(read({ edit: true, cwd })).rejects.toThrow(
		/No commit message file found.*commit-msg hook/s,
	);
});

test("throws an actionable error when --edit <file> points at a missing path", async () => {
	const cwd: string = await git.bootstrap();

	await expect(read({ edit: "does-not-exist", cwd })).rejects.toThrow(
		/No commit message file found.*Check that the path passed to --edit/s,
	);
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

test.each([
	{
		scenario: "leading spaces",
		message: "  feat: leading spaces",
		expected: "  feat: leading spaces",
	},
	{
		scenario: "trailing spaces",
		message: "feat: trailing spaces  ",
		expected: "feat: trailing spaces  ",
	},
	{
		scenario: "trailing blank lines",
		message: "feat: blank lines\n\n\n",
		expected: "feat: blank lines\n\n",
	},
	{
		scenario: "quotes before blank lines",
		message: '"feat: quoted"\n\n',
		expected: '"feat: quoted"\n',
	},
])("should keep $scenario in the last commit", async ({ message, expected }) => {
	const cwd: string = await git.bootstrap();

	await x("git", ["commit", "--allow-empty", "--cleanup=verbatim", "-m", message], {
		nodeOptions: { cwd },
	});

	const result = await read({ cwd, last: true });

	expect(result).toEqual([expected]);
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

	await x("git", ["commit", "--allow-empty", "-m", "chore: release v9.9.9-alpha.1"], {
		nodeOptions: { cwd },
	});
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

test("throws when from and to share no merge-base", async () => {
	const cwd: string = await git.bootstrap();
	await x("git", ["commit", "--allow-empty", "-m", "main commit"], {
		nodeOptions: { cwd },
	});
	const initialBranch = (
		await x("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
			nodeOptions: { cwd },
		})
	).stdout.trim();

	await x("git", ["checkout", "--orphan", "other"], { nodeOptions: { cwd } });
	await x("git", ["commit", "--allow-empty", "-m", "orphan commit"], {
		nodeOptions: { cwd },
	});

	await expect(read({ from: initialBranch, to: "other", cwd })).rejects.toThrow(
		/Cannot find merge-base/,
	);
});

test("throws when from has no merge-base with HEAD (no --to)", async () => {
	const cwd: string = await git.bootstrap();
	await x("git", ["commit", "--allow-empty", "-m", "main commit"], {
		nodeOptions: { cwd },
	});
	const initialBranch = (
		await x("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
			nodeOptions: { cwd },
		})
	).stdout.trim();

	await x("git", ["checkout", "--orphan", "other"], { nodeOptions: { cwd } });
	await x("git", ["commit", "--allow-empty", "-m", "orphan commit"], {
		nodeOptions: { cwd },
	});

	await expect(read({ from: initialBranch, cwd })).rejects.toThrow(/Cannot find merge-base/);
});

async function commitFile(cwd: string, file: string, message: string, content = file) {
	const fullPath = path.join(cwd, file);
	await fs.mkdir(path.dirname(fullPath), { recursive: true });
	await fs.writeFile(fullPath, content);
	await x("git", ["add", "--", file], { nodeOptions: { cwd } });
	await x("git", ["commit", "-m", message], { nodeOptions: { cwd } });
}

test("filters history commits by a single path", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): add a", "a1");
	await commitFile(cwd, "packages/b/b.txt", "feat(b): add b", "b1");
	await commitFile(cwd, "packages/a/a.txt", "fix(a): update a", "a2");

	const actual = await read({ cwd, path: "packages/a" });
	expect(actual).toEqual(["fix(a): update a\n\n", "feat(a): add a\n\n"]);
});

test("filters history commits by multiple paths and ignores empty path entries", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): add a");
	await commitFile(cwd, "packages/b/b.txt", "feat(b): add b");
	await commitFile(cwd, "packages/c/c.txt", "feat(c): add c");

	const actual = await read({ cwd, path: ["", "packages/a", "packages/c"] });
	expect(actual).toEqual(["feat(c): add c\n\n", "feat(a): add a\n\n"]);
});

test("filters commits within a from..to range by path", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): first", "1");
	await commitFile(cwd, "packages/b/b.txt", "feat(b): second", "2");
	await commitFile(cwd, "packages/a/a.txt", "feat(a): third", "3");
	await commitFile(cwd, "packages/a/a.txt", "feat(a): fourth", "4");

	const actual = await read({ cwd, from: "HEAD~3", to: "HEAD~1", path: "packages/a" });
	expect(actual).toEqual(["feat(a): third\n\n"]);
});

test("filters commits since the last tag by path", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "chore: release v1.0.0", "1");
	await x("git", ["tag", "v1.0.0"], { nodeOptions: { cwd } });
	await commitFile(cwd, "packages/b/b.txt", "feat(b): post-tag b", "2");
	await commitFile(cwd, "packages/a/a.txt", "feat(a): post-tag a", "3");

	const actual = await read({ cwd, fromLastTag: true, path: "packages/a" });
	expect(actual).toEqual(["feat(a): post-tag a\n\n"]);
});

test("filters the last commit by path", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): last in a");
	await commitFile(cwd, "packages/b/b.txt", "feat(b): last in b");

	expect(await read({ cwd, last: true, path: "packages/a" })).toEqual(["feat(a): last in a"]);
	expect(await read({ cwd, last: true, path: "packages/nonexistent" })).toEqual([]);
});

test("keeps empty string for last commit with empty message when path is not set", async () => {
	const cwd: string = await git.bootstrap();
	await x("git", ["commit", "--allow-empty", "--allow-empty-message", "-m", ""], {
		nodeOptions: { cwd },
	});

	expect(await read({ cwd, last: true })).toEqual([""]);
});

test("rejects bad paths the same way in last and range mode", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): first", "1");
	await commitFile(cwd, "packages/a/a.txt", "feat(a): second", "2");

	await expect(read({ cwd, last: true, path: "../outside" })).rejects.toThrow(/outside repository/);
	await expect(read({ cwd, from: "HEAD~1", path: "../outside" })).rejects.toThrow(
		/outside repository/,
	);
});

test("filters commits by paths containing spaces", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "dir with spaces/file one.txt", "feat: space path");
	await commitFile(cwd, "other/file.txt", "feat: other path");

	const actual = await read({ cwd, path: "dir with spaces" });
	expect(actual).toEqual(["feat: space path\n\n"]);
});

test("treats dash-prefixed paths as pathspecs rather than git flags", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "--weird-file", "feat: dash file");
	await commitFile(cwd, "normal.txt", "feat: normal file");

	expect(await read({ cwd, path: "--weird-file" })).toEqual(["feat: dash file\n\n"]);
	expect(await read({ cwd, path: "--all" })).toEqual([]);
	expect(await read({ cwd, last: true, path: "--weird-file" })).toEqual(["feat: dash file"]);
	expect(await read({ cwd, last: true, path: "--all" })).toEqual([]);
});

test("returns an empty list when no commits affect the specified path", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): add a");

	expect(await read({ cwd, path: "packages/nonexistent" })).toEqual([]);
});

test("combines path filtering with gitLogArgs", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): one", "1");
	await commitFile(cwd, "packages/b/b.txt", "feat(b): two", "2");
	await commitFile(cwd, "packages/a/a.txt", "feat(a): three", "3");
	await commitFile(cwd, "packages/a/a.txt", "feat(a): four", "4");

	const actual = await read({
		cwd,
		from: "HEAD~3",
		gitLogArgs: "--skip 1",
		path: "packages/a",
	});
	expect(actual).toEqual(["feat(a): three\n\n"]);
});

test("resolves relative path from a subdirectory cwd", async () => {
	const cwd: string = await git.bootstrap();
	await commitFile(cwd, "packages/a/a.txt", "feat(a): add a");
	await commitFile(cwd, "packages/b/b.txt", "feat(b): add b");

	const actual = await read({ cwd: path.join(cwd, "packages/a"), path: "." });
	expect(actual).toEqual(["feat(a): add a\n\n"]);
});
