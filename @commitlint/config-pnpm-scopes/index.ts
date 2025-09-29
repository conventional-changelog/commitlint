import path from "node:path";

import fg from "fast-glob";
import readYamlFileModule from "read-yaml-file";
import { readExactProjectManifest } from "@pnpm/read-project-manifest";
const readYamlFile = readYamlFileModule.default;

export default {
	utils: { getProjects },
	rules: {
		"scope-enum": (ctx = {}) =>
			getProjects(ctx).then((packages: any) => [2, "always", packages]),
	},
};

function requirePackagesManifest(dir: any) {
	return readYamlFile(path.join(dir, "pnpm-workspace.yaml")).catch(
		(err: any) => {
			if (err.code === "ENOENT") {
				return null;
			}

			throw err;
		},
	);
}

function normalizePatterns(patterns: any) {
	const normalizedPatterns = [];
	for (const pattern of patterns) {
		normalizedPatterns.push(pattern.replace(/\/?$/, "/package.json"));
		normalizedPatterns.push(pattern.replace(/\/?$/, "/package.json5"));
		normalizedPatterns.push(pattern.replace(/\/?$/, "/package.yaml"));
	}
	return normalizedPatterns;
}

function findWorkspacePackages(cwd: any) {
	return requirePackagesManifest(cwd)
		.then((manifest: any) => {
			const patterns = normalizePatterns(
				(manifest && manifest.packages) || ["**"],
			);
			const opts = {
				cwd,
				ignore: ["**/node_modules/**", "**/bower_components/**"],
			};

			return fg(patterns, opts);
		})
		.then((entries: any) => {
			const paths = Array.from(
				new Set(entries.map((entry: any) => path.join(cwd, entry))),
			);

			return Promise.all(
				paths.map((manifestPath: any) =>
					readExactProjectManifest(manifestPath),
				),
			);
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
