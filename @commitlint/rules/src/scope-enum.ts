import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const scopeEnum: SyncRule<
	string[] | {delimiter?: RegExp; values?: string[]}
> = (parsed, when = 'always', config = []) => {
	if (!parsed.scope) {
		return [true, ''];
	}

	let delimiters = /\/|\\|,/g;
	let value: string[] = [];
	if (!Array.isArray(config)) {
		if (config.delimiter) {
			delimiters = config.delimiter;
		}
		value = config.values || [];
	} else {
		value = config;
	}

	// Scopes may contain slash or comma delimiters to separate them and mark them as individual segments.
	// This means that each of these segments should be tested separately with `ensure`.

	const scopeSegments = parsed.scope.split(delimiters);

	const negated = when === 'never';
	const result =
		value.length === 0 ||
		scopeSegments.every((scope) => ensure.enum(scope, value));

	return [
		negated ? !result : result,
		message([
			`scope must`,
			negated ? `not` : null,
			`be one of [${value.join(', ')}]`,
		]),
	];
};
