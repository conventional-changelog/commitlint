import {wildcards} from './defaults.js';
import {IsIgnoredOptions} from '@commitlint/types';
import {validateIgnoreFunction} from './validate-ignore-func.js';

export default function isIgnored(
	commit: string = '',
	opts: IsIgnoredOptions = {}
): boolean {
	const ignores = typeof opts.ignores === 'undefined' ? [] : opts.ignores;

	if (!Array.isArray(ignores)) {
		throw new Error(
			`ignores must be of type array, received ${ignores} of type ${typeof ignores}`
		);
	}

	// Validate ignore functions
	ignores.forEach(validateIgnoreFunction);

	const invalids = ignores.filter((c) => typeof c !== 'function');

	if (invalids.length > 0) {
		throw new Error(
			`ignores must be array of type function, received items of type: ${invalids
				.map((i) => typeof i)
				.join(', ')}`
		);
	}

	const base = opts.defaults === false ? [] : wildcards;
	return [...base, ...ignores].some((w) => {
		const result = w(commit);
		if (typeof result !== 'boolean') {
			throw new Error(
				`Ignore function must return a boolean, received ${typeof result}`
			);
		}
		return result;
	});
}
