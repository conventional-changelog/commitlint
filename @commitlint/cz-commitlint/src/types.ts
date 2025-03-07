import { RuleConfigCondition, RuleConfigSeverity } from "@commitlint/types";

export type Rule =
	| Readonly<[RuleConfigSeverity.Disabled]>
	| Readonly<[RuleConfigSeverity, RuleConfigCondition]>
	| Readonly<[RuleConfigSeverity, RuleConfigCondition, unknown]>;
