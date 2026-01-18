import { test, expect } from "vitest";
import fs from "fs/promises";
import path from "node:path";
import os from "node:os";
import { git } from "@commitlint/test";

import toplevel from "./index.js";

test("should find git toplevel from repo root", async () => {
	const cwd = await git.bootstrap();
	const result = await toplevel(cwd);
	expect(result).toBe(cwd);
});

test("should find git toplevel from subdirectory", async () => {
	const cwd = await git.bootstrap();
	const subdir = path.join(cwd, "subdir");
	await fs.mkdir(subdir);

	const result = await toplevel(subdir);
	expect(result).toBe(cwd);
});

test("should prefer closer .git directory over farther .git file", async () => {
	// Create a parent directory with a .git file (simulating dotfiles bare repo)
	const parentDir = await fs.mkdtemp(path.join(os.tmpdir(), "parent-"));
	const gitFileContent = `gitdir: ${path.join(parentDir, ".rcfiles")}`;
	await fs.writeFile(path.join(parentDir, ".git"), gitFileContent);
	await fs.mkdir(path.join(parentDir, ".rcfiles"));

	// Create a child git repo inside the parent
	const childDir = path.join(parentDir, "child-repo");
	await fs.mkdir(childDir);
	await fs.mkdir(path.join(childDir, ".git"));

	// The toplevel should be the child repo, not the parent
	const result = await toplevel(childDir);
	expect(result).toBe(childDir);

	// Cleanup
	await fs.rm(parentDir, { recursive: true });
});

test("should handle .git file (submodule) correctly", async () => {
	const cwd = await git.bootstrap();

	// Create a submodule-like structure with a .git file
	const submoduleDir = path.join(cwd, "submodule");
	await fs.mkdir(submoduleDir);
	const gitFileContent = `gitdir: ${path.join(cwd, ".git", "modules", "submodule")}`;
	await fs.writeFile(path.join(submoduleDir, ".git"), gitFileContent);

	const result = await toplevel(submoduleDir);
	expect(result).toBe(submoduleDir);
});

test("should return undefined when no .git found", async () => {
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "no-git-"));

	const result = await toplevel(tmpDir);
	expect(result).toBeUndefined();

	await fs.rm(tmpDir, { recursive: true });
});
