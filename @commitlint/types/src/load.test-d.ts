/**
 * Compile-time type checks for `UserConfig` and `ParserPreset`.
 * If a line fails to compile, the associated type definition needs to be fixed.
 */

import { assertType, test } from "vitest";

import type { ParserPreset, UserConfig } from "./index.js";

// Regression: `parserPreset.presetConfig` must be assignable when configuring
// a preset like `conventional-changelog-conventionalcommits`. See #4748.
test("UserConfig accepts parserPreset.presetConfig", () => {
	assertType<UserConfig>({
		parserPreset: {
			name: "conventional-changelog-conventionalcommits",
			presetConfig: {
				types: [
					{ type: "feat", section: "Features" },
					{ type: "fix", section: "Bug Fixes" },
					{ type: "docs", section: "Documentation", hidden: false },
					{ type: "chore", hidden: true },
				],
			},
		},
	});
});

test("ParserPreset accepts presetConfig", () => {
	assertType<ParserPreset>({
		name: "conventional-changelog-conventionalcommits",
		presetConfig: { types: [] },
	});
});
