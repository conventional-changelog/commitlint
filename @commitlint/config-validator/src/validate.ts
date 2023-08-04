import Ajv from 'ajv';
import {UserConfig} from '@commitlint/types';
import schema from './commitlint.schema.json';
import {formatErrors} from './formatErrors';

const TYPE_OF = [
	'undefined',
	'string',
	'number',
	'object',
	'function',
	'boolean',
	'symbol',
];

export function validateConfig(
	source: string,
	config: unknown,
): asserts config is UserConfig {
	const ajv = new Ajv({
		meta: false,
		strict: false,
		useDefaults: true,
		validateSchema: false,
		verbose: true,
	});

	ajv.addKeyword({
		keyword: 'typeof',
		validate: function typeOfFunc(schema: any, data: any) {
			return typeof data === schema;
		},
		metaSchema: {type: 'string', enum: TYPE_OF},
		schema: true,
	});

	const validate = ajv.compile(schema);
	const isValid = validate(config);

	if (!isValid && validate.errors && validate.errors.length) {
		throw new Error(
			`Commitlint configuration in ${source} is invalid:\n${formatErrors(
				validate.errors,
			)}`,
		);
	}
}
