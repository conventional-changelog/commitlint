import { describe, test, expect, vi } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { RuleConfigSeverity } from "@commitlint/types";
import { fix, git, npm } from "@commitlint/test";

import load, { resolveFrom } from "./load.js";
import { isDynamicAwaitSupported } from "./utils/load-config.js";

const __dirname = path.resolve(fileURLToPath(import.meta.url), "..");

const plugin = vi.fn();
const scopedPlugin = vi.fn();

vi.mock("commitlint-plugin-example", () => ({
	default: plugin,
}));
vi.mock("@scope/commitlint-plugin-example", () => ({
	default: scopedPlugin,
}));

const fixBootstrap = (name: string) => fix.bootstrap(name, __dirname);
const gitBootstrap = (name: string) => git.bootstrap(name, __dirname);
const npmBootstrap = (name: string) => npm.bootstrap(name, __dirname);

test("extends-empty should have no rules", async () => {
	const cwd = await gitBootstrap("fixtures/extends-empty");
	const actual = await load({}, { cwd });

	expect(actual.rules).toMatchObject({});
	expect(actual.parserPreset).not.toBeDefined();
});

test("uses seed as configured", async () => {
	const cwd = await gitBootstrap("fixtures/extends-empty");
	const rules = {
		"body-case": [RuleConfigSeverity.Warning, "never", "camel-case"] as any,
	};

	const actual = await load({ rules }, { cwd });

	expect(actual.rules["body-case"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"camel-case",
	]);
});

test("rules should be loaded from local", async () => {
	const actual = await load({
		rules: {
			direct: [RuleConfigSeverity.Warning, "never", "foo"],
			func: () => [RuleConfigSeverity.Warning, "never", "foo"],
			async: async () => [RuleConfigSeverity.Warning, "never", "foo"],
			promise: () =>
				Promise.resolve([RuleConfigSeverity.Warning, "never", "foo"]),
		},
	});

	expect(actual.rules["direct"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"foo",
	]);
	expect(actual.rules["func"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"foo",
	]);
	expect(actual.rules["async"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"foo",
	]);
	expect(actual.rules["promise"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"foo",
	]);
});

test("rules should be loaded from relative config file", async () => {
	const file = "config/commitlint.config.js";
	const cwd = await gitBootstrap("fixtures/specify-config-file");
	const rules = {
		"body-case": [RuleConfigSeverity.Warning, "never", "camel-case"] as any,
	};

	const actual = await load({ rules }, { cwd, file });

	expect(actual.rules["body-case"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"camel-case",
	]);
});

test("rules should be loaded from absolute config file", async () => {
	const cwd = await gitBootstrap("fixtures/specify-config-file");
	const file = path.resolve(cwd, "config/commitlint.config.js");
	const rules = {
		"body-case": [RuleConfigSeverity.Warning, "never", "camel-case"] as any,
	};

	const actual = await load({ rules }, { cwd: process.cwd(), file });

	expect(actual.rules["body-case"]).toStrictEqual([
		RuleConfigSeverity.Warning,
		"never",
		"camel-case",
	]);
});

test("plugins should be loaded from seed", async () => {
	const cwd = await gitBootstrap("fixtures/extends-empty");
	const actual = await load(
		{ plugins: ["example", "@scope/example"] },
		{ cwd }
	);

	expect(actual.plugins).toMatchObject({
		example: plugin,
		"@scope/example": scopedPlugin,
	});
});

test("plugins should be loaded from local", async () => {
	const actual = await load({
		plugins: [
			{
				rules: {
					test: () => [true, "asd"],
				},
			},
		],
	});

	expect(actual.plugins).toEqual(
		expect.objectContaining({
			local: {
				rules: {
					test: expect.any(Function),
				},
			},
		})
	);
});

test("plugins should be loaded from config", async () => {
	const cwd = await gitBootstrap("fixtures/extends-plugins");
	const actual = await load({}, { cwd });

	expect(actual.plugins).toMatchObject({
		example: plugin,
		"@scope/example": scopedPlugin,
	});
});

test("plugins should be loaded from shareable config", async () => {
	const cwd = await gitBootstrap("fixtures/extends-with-plugins");
	const actual = await load({}, { cwd });

	expect(actual.plugins).toMatchObject({
		example: plugin,
		"@scope/example": scopedPlugin,
	});
});

test("local plugins should be loaded from shareable configs", async () => {
	const cwd = await gitBootstrap("fixtures/extends-with-local-plugins");
	const actual = await load({}, { cwd });

	expect(actual.plugins).toEqual(
		expect.objectContaining({
			local: {
				rules: {
					"hello-world-rule": expect.any(Function),
					"is-positive": expect.any(Function),
				},
			},
		})
	);
});

test("uses seed with parserPreset", async () => {
	const cwd = await gitBootstrap("fixtures/parser-preset");
	const { parserPreset: actual } = await load(
		{ parserPreset: "./conventional-changelog-custom" },
		{ cwd }
	);

	expect(actual).toBeDefined();
	expect(actual!.name).toBe("./conventional-changelog-custom");
	expect(actual!.parserOpts).toMatchObject({
		headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
	});
});

test("invalid extend should throw", async () => {
	const cwd = await gitBootstrap("fixtures/extends-invalid");

	await expect(load({}, { cwd })).rejects.toThrow();
});

test("empty file should have no rules", async () => {
	const cwd = await gitBootstrap("fixtures/empty-object-file");
	const actual = await load({}, { cwd });

	expect(actual.rules).toMatchObject({});
});

test("empty file should extend nothing", async () => {
	const cwd = await gitBootstrap("fixtures/empty-file");
	const actual = await load({}, { cwd });

	expect(actual.extends).toHaveLength(0);
});

test("respects cwd option", async () => {
	const cwd = await gitBootstrap("fixtures/recursive-extends/first-extended");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "@commitlint/format",
		extends: ["./second-extended"],
		plugins: {},
		rules: {
			one: [RuleConfigSeverity.Warning, "always"],
			two: [RuleConfigSeverity.Error, "never"],
		},
	});
});

describe.each([["basic"], ["extends"]])("%s config", (template) => {
	const isExtendsTemplate = template === "extends";

	const configFiles = [
		"commitlint.config.cjs",
		"commitlint.config.js",
		"commitlint.config.mjs",
		"deno.json",
		"package.json",
		"package.yaml",
		".commitlintrc",
		".commitlintrc.cjs",
		".commitlintrc.js",
		".commitlintrc.json",
		".commitlintrc.mjs",
		".commitlintrc.yml",
		".commitlintrc.yaml",
	];

	const configTestCases = [
		...configFiles
			.filter((filename) => !filename.endsWith(".mjs"))
			.map((filename) => ({ filename, isEsm: false })),
		...configFiles
			.filter((filename) =>
				[".mjs", ".js"].some((ext) => filename.endsWith(ext))
			)
			.map((filename) => ({ filename, isEsm: true })),
	];

	const getConfigContents = ({
		filename,
		isEsm,
	}: {
		filename: string;
		isEsm: boolean;
	}): string | NodeJS.ArrayBufferView => {
		if (filename === "package.json" || filename === "deno.json") {
			const configPath = path.join(
				__dirname,
				`../fixtures/${template}-config/.commitlintrc.json`
			);
			const commitlint = JSON.parse(
				readFileSync(configPath, { encoding: "utf-8" })
			);
			return JSON.stringify({ commitlint });
		} else if (filename === "package.yaml") {
			const configPath = path.join(
				__dirname,
				`../fixtures/${template}-config/.commitlintrc.yaml`
			);
			const yaml = readFileSync(configPath, { encoding: "utf-8" });
			return `commitlint:\n${yaml.replace(/^/gm, "  ")}`;
		} else {
			const filePath = ["..", "fixtures", `${template}-config`, filename];

			if (isEsm) {
				filePath.splice(3, 0, "esm");
			}

			const configPath = path.join(__dirname, filePath.join("/"));
			return readFileSync(configPath);
		}
	};

	const esmBootstrap = (cwd: string) => {
		const packageJsonPath = path.join(cwd, "package.json");
		const packageJSON = JSON.parse(
			readFileSync(packageJsonPath, { encoding: "utf-8" })
		);

		writeFileSync(
			packageJsonPath,
			JSON.stringify({
				...packageJSON,
				type: "module",
			})
		);
	};

	const templateFolder = [template, isExtendsTemplate ? "js" : "", "template"]
		.filter((elem) => elem)
		.join("-");

	test.each(
		configTestCases
			// Skip ESM tests for the extends suite until resolve-extends supports ESM
			.filter(({ isEsm }) => template !== "extends" || !isEsm)
			// Skip ESM tests if dynamic await is not supported; Jest will crash with a seg fault error
			.filter(({ isEsm }) => isDynamicAwaitSupported() || !isEsm)
	)("$filename, ESM: $isEsm", async ({ filename, isEsm }) => {
		const cwd = await gitBootstrap(`fixtures/${templateFolder}`);

		if (isEsm) {
			esmBootstrap(cwd);
		}

		writeFileSync(
			path.join(cwd, filename),
			getConfigContents({ filename, isEsm })
		);

		const actual = await load({}, { cwd });

		expect(actual).toMatchObject({
			formatter: "@commitlint/format",
			extends: isExtendsTemplate ? ["./first-extended"] : [],
			plugins: {},
			rules: {
				zero: [RuleConfigSeverity.Disabled, "never"],
				one: [RuleConfigSeverity.Warning, "always"],
				two: [RuleConfigSeverity.Error, "never"],
			},
		});
	});
});

test("recursive extends with ts file", async () => {
	const cwd = await gitBootstrap("fixtures/recursive-extends-ts");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "@commitlint/format",
		extends: ["./first-extended/index.ts"],
		plugins: {},
		rules: {
			zero: [RuleConfigSeverity.Disabled, "never", "zero"],
			one: [RuleConfigSeverity.Warning, "never", "one"],
			two: [RuleConfigSeverity.Error, "never", "two"],
		},
	});
});

test("parser preset overwrites completely instead of merging", async () => {
	const cwd = await gitBootstrap("fixtures/parser-preset-override");
	const actual = await load({}, { cwd });

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe("./custom");
	expect(actual.parserPreset!.parserOpts).toMatchObject({
		headerPattern: /.*/,
	});
});

test("recursive extends with parserPreset", async () => {
	const cwd = await gitBootstrap("fixtures/recursive-parser-preset");
	const actual = await load({}, { cwd });

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe("./conventional-changelog-custom");
	expect(actual.parserPreset!.parserOpts).toMatchObject({
		headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
	});
});

test("ignores unknown keys", async () => {
	const cwd = await gitBootstrap("fixtures/trash-file");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "@commitlint/format",
		extends: [],
		plugins: {},
		rules: {
			foo: [RuleConfigSeverity.Warning, "always", "bar"],
			baz: [RuleConfigSeverity.Warning, "always", "bar"],
		},
	});
});

test("ignores unknown keys recursively", async () => {
	const cwd = await gitBootstrap("fixtures/trash-extend");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "@commitlint/format",
		extends: ["./one"],
		plugins: {},
		rules: {
			zero: [RuleConfigSeverity.Disabled, "always", "zero"],
			one: [RuleConfigSeverity.Warning, "always", "one"],
		},
	});
});

test("find up from given cwd", async () => {
	const outer = await fixBootstrap("fixtures/outer-scope");
	await git.init(path.join(outer, "inner-scope"));
	const cwd = path.join(outer, "inner-scope", "child-scope");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "@commitlint/format",
		extends: [],
		plugins: {},
		rules: {
			child: [RuleConfigSeverity.Error, "always", true],
			inner: [RuleConfigSeverity.Error, "always", false],
			outer: [RuleConfigSeverity.Error, "always", false],
		},
	});
});

test("find up config from outside current git repo", async () => {
	const outer = await fixBootstrap("fixtures/outer-scope");
	const cwd = await git.init(path.join(outer, "inner-scope"));
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "@commitlint/format",
		extends: [],
		plugins: {},
		rules: {
			child: [RuleConfigSeverity.Warning, "never", false],
			inner: [RuleConfigSeverity.Warning, "never", false],
			outer: [RuleConfigSeverity.Warning, "never", true],
		},
	});
});

test("respects formatter option", async () => {
	const cwd = await gitBootstrap("fixtures/formatter");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: "commitlint-junit",
		extends: [],
		plugins: {},
		rules: {},
	});
});

test("resolves formatter relative from config directory", async () => {
	const cwd = await gitBootstrap("fixtures/formatter-local-module");
	const actual = await load({}, { cwd });

	expect(actual).toMatchObject({
		formatter: resolveFrom("./formatters/custom.js", cwd),
		extends: [],
		plugins: {},
		rules: {},
	});
});

test("returns formatter name when unable to resolve from config directory", async () => {
	const cwd = await gitBootstrap("fixtures/formatter-local-module");
	const actual = await load({ formatter: "./doesnt/exists.js" }, { cwd });

	expect(actual).toMatchObject({
		formatter: "./doesnt/exists.js",
		extends: [],
		plugins: {},
		rules: {},
	});
});

test("does not mutate config module reference", async () => {
	const file = "config/commitlint.config.js";
	const cwd = await gitBootstrap("fixtures/specify-config-file");
	const rules = {
		"body-case": [RuleConfigSeverity.Warning, "never", "camel-case"] as any,
	};

	const configPath = path.join(cwd, file);

	const before = readFileSync(configPath, { encoding: "utf-8" });
	await load({ rules }, { cwd, file });
	const after = readFileSync(configPath, { encoding: "utf-8" });

	expect(after).toBe(before);
});

test("resolves parser preset from conventional commits", async () => {
	const cwd = await npmBootstrap("fixtures/parser-preset-conventionalcommits");
	const actual = await load({}, { cwd });

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe(
		"conventional-changelog-conventionalcommits"
	);
	expect(typeof actual.parserPreset!.parserOpts).toBe("object");
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});

test("resolves parser preset from conventional angular", async () => {
	const cwd = await npmBootstrap("fixtures/parser-preset-angular");
	const actual = await load({}, { cwd });

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe("conventional-changelog-angular");
	expect(typeof actual.parserPreset!.parserOpts).toBe("object");
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?: (.*)$/
	);
});

test("recursive resolves parser preset from conventional atom", async () => {
	const cwd = await gitBootstrap(
		"fixtures/recursive-parser-preset-conventional-atom"
	);
	await npm.installModules(
		path.resolve(cwd, "first-extended", "second-extended")
	);

	const actual = await load({}, { cwd });

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe("conventional-changelog-atom");
	expect(typeof actual.parserPreset!.parserOpts).toBe("object");
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(:.*?:) (.*)$/
	);
});

test("resolves parser preset from conventional commits without factory support", async () => {
	const cwd = await npmBootstrap(
		"fixtures/parser-preset-conventional-without-factory"
	);
	const actual = await load({}, { cwd });

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe(
		"conventional-changelog-conventionalcommits"
	);
	expect(typeof actual.parserPreset!.parserOpts).toBe("object");
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});

test("helpUrl should be loaded from the shareable config", async () => {
	const cwd = await gitBootstrap("fixtures/help-url");
	const actual = await load({}, { cwd });

	expect(actual.helpUrl).toStrictEqual(
		"https://github.com/conventional-changelog/commitlint"
	);
});

test("default helpUrl should be loaded if not provided in shareable configs", async () => {
	const cwd = await gitBootstrap("fixtures/basic");
	const actual = await load({}, { cwd });

	expect(actual.helpUrl).toStrictEqual(
		"https://github.com/conventional-changelog/commitlint/#what-is-commitlint"
	);
});
