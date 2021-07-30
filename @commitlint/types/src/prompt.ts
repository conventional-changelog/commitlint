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
	messages: PromptMessages;
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

export type PromptMessages = {
	skip?: string;
	max?: string;
	min?: string;
	emptyWarning?: string;
	upperLimitWarning?: string;
	lowerLimitWarning?: string;
};

export type UserPromptConfig = DeepPartial<PromptConfig>;

type DeepPartial<T> = {
	[P in keyof T]?: {
		[K in keyof T[P]]?: T[P][K];
	};
};
