import {UserConfig} from '../types';
import {pick} from 'lodash';

export const pickConfig = (input: unknown): UserConfig =>
	pick(
		input,
		'extends',
		'rules',
		'plugins',
		'parserPreset',
		'formatter',
		'ignores',
		'defaultIgnores'
	);
