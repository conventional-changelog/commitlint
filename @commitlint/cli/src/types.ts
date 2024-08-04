export interface CliFlags {
	color: boolean;
	config?: string;
	cwd: string;
	edit?: string | boolean;
	env?: string;
	extends?: (string | number)[];
	help?: boolean;
	'help-url'?: string;
	from?: string;
	'from-last-tag'?: boolean;
	'git-log-args'?: string;
	last?: boolean;
	format?: string;
	'parser-preset'?: string;
	quiet: boolean;
	to?: string;
	version?: boolean;
	verbose?: boolean;
	/** @type {'' | 'text' | 'json'} */
	'print-config'?: string;
	strict?: boolean;
	_: (string | number)[];
	$0: string;
}
