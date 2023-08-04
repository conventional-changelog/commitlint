import {ErrorObject} from 'ajv';

/**
 * Formats an array of schema validation errors.
 * @param errors An array of error messages to format.
 * @returns Formatted error message
 * Based on https://github.com/eslint/eslint/blob/master/lib/shared/config-validator.js#L237-L261
 */
export function formatErrors(errors: ErrorObject[]): string {
	return errors
		.map((error) => {
			if (
				error.keyword === 'additionalProperties' &&
				'additionalProperty' in error.params
			) {
				const formattedPropertyPath = error.instancePath.length
					? `${error.instancePath.slice(1)}.${error.params.additionalProperty}`
					: error.params.additionalProperty;

				return `Unexpected top-level property "${formattedPropertyPath}"`;
			}
			if (error.keyword === 'type') {
				const formattedField = error.instancePath.slice(1);
				if (!formattedField) {
					return `Config has the wrong type - ${error.message}`;
				}
				return `Property "${formattedField}" has the wrong type - ${error.message}`;
			}
			const field =
				(error.instancePath[0] === '.'
					? error.instancePath.slice(1)
					: error.instancePath) || 'Config';
			if (error.keyword === 'typeof') {
				return `"${field}" should be a ${error.schema}. Value: ${JSON.stringify(
					error.data,
				)}`;
			}

			return `"${field}" ${error.message}. Value: ${JSON.stringify(
				error.data,
			)}`;
		})
		.map((message) => `\t- ${message}.\n`)
		.join('');
}
