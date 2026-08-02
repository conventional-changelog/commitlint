import { RuleConfigSeverity } from "@commitlint/types";
import type { UserConfig } from "@commitlint/types";

export default {
	rules: {
		"header-max-length": [RuleConfigSeverity.Error, "always", 100],
	},
} satisfies UserConfig;
