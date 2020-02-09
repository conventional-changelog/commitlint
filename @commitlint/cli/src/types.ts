export interface CliFlags {
	color: boolean;
	config?: string;
	cwd: string;
	edit?: string | boolean;
	env?: string;
	extends?: (string | number)[];
	help?: boolean;
	helpUrl?: string;
	from?: string;
	format?: string;
	parserPreset?: string;
	quiet: boolean;
	to?: string;
	version?: boolean;
	verbose?: boolean;
	_: string[];
	$0: string;
}

export interface Seed {
	extends?: string[];
	parserPreset?: string;
}
