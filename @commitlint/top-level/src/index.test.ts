import { test, expect, describe } from "vitest";
import path from "node:path";
import fs from "fs-extra";
import tmp from "tmp";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { realpathSync } from "node:fs";

import toplevel from "./index.js";

const execFileAsync = promisify(execFile);

/**
 * Normalize a path for cross-platform comparison.
 * On Windows, tmp paths may use short names (e.g., RUNNER~1) while git returns long names.
 * This resolves symlinks and normalizes the path format.
 */
function normalizePath(p: string): string {
	return realpathSync(p).replace(/\\/g, "/");
}

async function initGitRepo(cwd: string): Promise<void> {
	await execFileAsync("git", ["init"], { cwd });
	await execFileAsync("git", ["config", "user.email", "test@example.com"], {
		cwd,
	});
	await execFileAsync("git", ["config", "user.name", "test"], { cwd });
	await execFileAsync("git", ["config", "commit.gpgsign", "false"], { cwd });
}

describe("toplevel", () => {
	test("should return git root for a regular repository", async () => {
		const tmpDir = tmp.dirSync({ keep: false, unsafeCleanup: true });
		const repoDir = tmpDir.name;

		await initGitRepo(repoDir);

		const result = await toplevel(repoDir);
		expect(normalizePath(result!)).toBe(normalizePath(repoDir));
	});

	test("should return git root from a subdirectory", async () => {
		const tmpDir = tmp.dirSync({ keep: false, unsafeCleanup: true });
		const repoDir = tmpDir.name;

		await initGitRepo(repoDir);

		const subDir = path.join(repoDir, "sub", "dir");
		await fs.mkdirp(subDir);

		const result = await toplevel(subDir);
		expect(normalizePath(result!)).toBe(normalizePath(repoDir));
	});

	test("should return undefined for a non-git directory", async () => {
		const tmpDir = tmp.dirSync({ keep: false, unsafeCleanup: true });

		const result = await toplevel(tmpDir.name);
		expect(result).toBeUndefined();
	});

	test("should work with git worktrees", async () => {
		const tmpDir = tmp.dirSync({ keep: false, unsafeCleanup: true });
		const mainRepoDir = path.join(tmpDir.name, "main");
		const worktreeDir = path.join(tmpDir.name, "worktree");

		await fs.mkdirp(mainRepoDir);
		await initGitRepo(mainRepoDir);

		// Create an initial commit (required for worktree)
		await fs.writeFile(path.join(mainRepoDir, "file.txt"), "content");
		await execFileAsync("git", ["add", "."], { cwd: mainRepoDir });
		await execFileAsync("git", ["commit", "-m", "initial"], {
			cwd: mainRepoDir,
		});

		// Create a new branch for the worktree
		await execFileAsync("git", ["branch", "worktree-branch"], {
			cwd: mainRepoDir,
		});

		// Create the worktree
		await execFileAsync(
			"git",
			["worktree", "add", worktreeDir, "worktree-branch"],
			{ cwd: mainRepoDir },
		);

		// toplevel should return the worktree directory, not the main repo
		const result = await toplevel(worktreeDir);
		expect(normalizePath(result!)).toBe(normalizePath(worktreeDir));
	});

	test("should work from a subdirectory of a git worktree", async () => {
		const tmpDir = tmp.dirSync({ keep: false, unsafeCleanup: true });
		const mainRepoDir = path.join(tmpDir.name, "main");
		const worktreeDir = path.join(tmpDir.name, "worktree");

		await fs.mkdirp(mainRepoDir);
		await initGitRepo(mainRepoDir);

		// Create an initial commit
		await fs.writeFile(path.join(mainRepoDir, "file.txt"), "content");
		await execFileAsync("git", ["add", "."], { cwd: mainRepoDir });
		await execFileAsync("git", ["commit", "-m", "initial"], {
			cwd: mainRepoDir,
		});

		// Create a new branch and worktree
		await execFileAsync("git", ["branch", "worktree-branch"], {
			cwd: mainRepoDir,
		});
		await execFileAsync(
			"git",
			["worktree", "add", worktreeDir, "worktree-branch"],
			{ cwd: mainRepoDir },
		);

		// Create a subdirectory in the worktree
		const subDir = path.join(worktreeDir, "sub", "dir");
		await fs.mkdirp(subDir);

		// toplevel from subdirectory should return the worktree root
		const result = await toplevel(subDir);
		expect(normalizePath(result!)).toBe(normalizePath(worktreeDir));
	});
});
