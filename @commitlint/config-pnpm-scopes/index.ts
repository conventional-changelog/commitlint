import path from "node:path";

import { glob } from "node:fs/promises";
import picomatch from "picomatch";
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

function workspacePatterns(patterns: string[], cwd: string) {
	const included: string[] = [];
	const excluded: string[] = [];
	for (const pattern of patterns) {
		const manifest = pattern.replace(/\/?$/, "/package.{json,json5,yaml}");
		// Match pnpm's tinyglobby pattern handling: !(...) stays inclusive,
		// and a double bang is ignored unless it excludes an extglob.
		if (!pattern.startsWith("!") || pattern.startsWith("!(")) {
			included.push(manifest);
		} else if (!pattern.startsWith("!!") || pattern.startsWith("!!(")) {
			const exclusion = manifest.slice(1);
			// Match absolute exclusions relative to the workspace. Keep escapes
			// such as \! in relative globs so the matcher can read the literal bang.
			const absolute = path.posix.isAbsolute(exclusion) || path.parse(exclusion).root.length > 1;
			const relative = absolute
				? path.relative(cwd, exclusion).split(path.sep).join("/")
				: exclusion;
			excluded.push(path.posix.normalize(relative));
		}
	}
	const matches = picomatch(excluded, { posix: true });
	function isExcluded(entry: string) {
		if (excluded.length === 0) return false;
		const relative = path.isAbsolute(entry) ? path.relative(cwd, entry) : entry;
		return matches(relative.split(path.sep).join("/"));
	}
	return { included, isExcluded };
}

function findWorkspacePackages(cwd: any) {
	return requirePackagesManifest(cwd)
		.then(async (manifest: any) => {
			const { included, isExcluded } = workspacePatterns(manifest?.packages || ["**"], cwd);
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
