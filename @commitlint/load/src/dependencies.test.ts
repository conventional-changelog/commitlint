import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

interface Manifest {
	dependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

const readManifest = (dir: string): Manifest =>
	JSON.parse(readFileSync(path.join(dir, "package.json"), "utf-8"));

// npm and pnpm auto-install required peers, so a dependency that requires these
// makes every commitlint user download them, even without a TypeScript config.
test.each(["typescript", "@types/node"])("no runtime dependency requires %s as a peer", (peer) => {
	const { dependencies = {} } = readManifest(packageDir);

	const requiring = Object.keys(dependencies).filter((name) => {
		const manifest = readManifest(path.join(packageDir, "node_modules", name));
		return (
			manifest.peerDependencies?.[peer] !== undefined &&
			manifest.peerDependenciesMeta?.[peer]?.optional !== true
		);
	});

	expect(requiring).toEqual([]);
});
