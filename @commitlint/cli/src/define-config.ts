export type CommitlintConfig = {
	extends?: string | string[];
	formatter?: string;
	rules?: Record<string, unknown>;
	parserPreset?: string | Record<string, unknown>;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins?: (string | Record<string, unknown>)[];
	helpUrl?: string;
	prompt?: Record<string, unknown>;
	[key: string]: unknown;
};

export function defineConfig(config: CommitlintConfig): CommitlintConfig {
	return config;
}
