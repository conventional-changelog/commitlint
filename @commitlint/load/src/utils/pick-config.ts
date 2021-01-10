import pick from 'lodash/pick';

export const pickConfig = (input: unknown): Record<string, unknown> =>
	pick(
		input,
		'extends',
		'rules',
		'plugins',
		'parserPreset',
		'formatter',
		'ignores',
		'defaultIgnores',
		'helpUrl'
	);
