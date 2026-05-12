/**
 * Compile-time type checks for `UserConfig` and `ParserPreset`.
 * If a line fails to compile, the associated type definition needs to be fixed.
 */

import type { ParserPreset, UserConfig } from "./index.js";

// Regression: `parserPreset.presetConfig` must be assignable when configuring
// a preset like `conventional-changelog-conventionalcommits`. See #4748.
const _presetConfigCheck: UserConfig = {
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
};
void _presetConfigCheck;

const _parserPresetCheck: ParserPreset = {
	name: "conventional-changelog-conventionalcommits",
	presetConfig: { types: [] },
};
void _parserPresetCheck;
