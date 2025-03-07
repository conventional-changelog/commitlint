import type {RuleConfigCondition, RuleConfigSeverity} from '@commitlint/types';

export type RuleEntry =
	| [string, Readonly<[RuleConfigSeverity.Disabled]>]
	| [string, Readonly<[RuleConfigSeverity, RuleConfigCondition]>]
	| [string, Readonly<[RuleConfigSeverity, RuleConfigCondition, unknown]>];

export type InputSetting = {
	description?: string;
	enumerables?: Record<
		string,
		{
			description: string;
		}
	>;
	multiline?: boolean;
	header?: {
		length?: number;
	};
};

export type ResultPart = 'type' | 'scope' | 'subject' | 'body' | 'footer';

export type Result = Partial<Record<ResultPart, string | undefined>>;
