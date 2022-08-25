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
	'git-log-args'?: string;
	format?: string;
	'parser-preset'?: string;
	quiet: boolean;
	to?: string;
	version?: boolean;
	verbose?: boolean;
	'print-config'?: boolean;
	_: (string | number)[];
	$0: string;
}
