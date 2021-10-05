export interface UserConfig {
	extends?: string[];
	formatter?: string;
	rules?: any;
	parserPreset?: any;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins?: (string | Plugin)[];
	helpUrl?: string;
	prompt?: any;
}