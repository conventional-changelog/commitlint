import {UserConfig} from '@commitlint/types';
import pick from 'lodash/pick';

export const pickConfig = (input: unknown): UserConfig =>
	pick(
		input,
		'extends',
		'rules',
		'plugins',
		'parserPreset',
		'formatter',
		'ignores',
		'defaultIgnores',
		'helpUrl',
		'prompt'
	);
