import {RuleConfigCondition, RuleConfigSeverity} from '@commitlint/types';

export type Rule =
	| Readonly<[RuleConfigSeverity.Disabled]>
	| Readonly<[RuleConfigSeverity, RuleConfigCondition]>
	| Readonly<[RuleConfigSeverity, RuleConfigCondition, unknown]>;

export type RuleField =
	| 'header'
	| 'type'
	| 'scope'
	| 'subject'
	| 'body'
	| 'footer';

export type PromptName =
	| RuleField
	| 'isBreaking'
	| 'breakingBody'
	| 'breaking'
	| 'isIssueAffected'
	| 'issuesBody'
	| 'issues';

export type PromptConfig = {
	messages: {[K: string]: string};
	questions: Partial<
		Record<
			PromptName,
			{
				description?: string;
				messages?: {[K: string]: string};
				enum?: {
					[enumName: string]: {
						description?: string;
						title?: string;
						emoji?: string;
					};
				};
			}
		>
	>;
};
