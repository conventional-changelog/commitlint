import path from "node:path";

import { glob } from "node:fs/promises";
import { readYamlFile } from "read-yaml-file";
import { readExactProjectManifest } from "@pnpm/read-project-manifest";

export default {
	utils: { getProjects },
	rules: {
		"scope-enum": (ctx = {}) => getProjects(ctx).then((packages: any) => [2, "always", packages]),
	},
};

function requirePackagesManifest(dir: any) {
	return readYamlFile(path.join(dir, "pnpm-workspace.yaml")).catch((err: any) => {
		if (err.code === "ENOENT") {
			return null;
		}

		throw err;
	});
}

function workspacePatterns(patterns: string[]) {
	const included: string[] = [];
	const excluded: string[] = [];
	for (const pattern of patterns) {
		const manifest = pattern.replace(/\/?$/, "/package.{json,json5,yaml}");
		if (pattern.startsWith("!")) {
			excluded.push(path.posix.normalize(manifest.slice(1)));
		} else {
			included.push(manifest);
		}
	}
	const isExcluded = (entry: string) =>
		excluded.some((glob) => path.posix.matchesGlob(entry.split(path.sep).join("/"), glob));
	return { included, isExcluded };
}

function findWorkspacePackages(cwd: any) {
	return requirePackagesManifest(cwd)
		.then(async (manifest: any) => {
			const { included, isExcluded } = workspacePatterns(manifest?.packages || ["**"]);
			const entries: string[] = [];
			for await (const entry of glob(included, {
				cwd,
				exclude: (p) => p.includes("node_modules") || p.includes("bower_components"),
			})) {
				if (!isExcluded(entry)) {
					entries.push(entry);
				}
			}
			return entries;
		})
		.then((entries: any) => {
			const paths = Array.from(new Set(entries.map((entry: any) => path.join(cwd, entry))));

			return Promise.all(paths.map((manifestPath: any) => readExactProjectManifest(manifestPath)));
		})
		.then((manifests: any) => {
			return manifests.map((manifest: any) => manifest.manifest);
		});
}

function getProjects(context: any) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	return findWorkspacePackages(cwd).then((projects: any) => {
		const scopes = projects.reduce((acc: any, project: any) => {
			const name = project.name;

			if (name) {
				acc.add(name.charAt(0) === "@" ? name.split("/")[1] : name);
			}

			return acc;
		}, new Set());
		scopes.add("global");

		return Array.from(scopes).sort();
	});
}
