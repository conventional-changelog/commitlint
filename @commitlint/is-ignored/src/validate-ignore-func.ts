import {Matcher} from '@commitlint/types';

export function validateIgnoreFunction(fn: Matcher) {
	const fnString = fn.toString();

	// Check for dangerous patterns
	const dangerousPattern =
		/(?:process|require|import|eval|fetch|XMLHttpRequest|fs|child_process)(?:\s*\.|\s*\()|(?:exec|execFile|spawn)\s*\(/;
	if (dangerousPattern.test(fnString)) {
		// Find which pattern matched for a more specific error message
		const match = fnString.match(dangerousPattern);
		throw new Error(
			`Ignore function contains forbidden pattern: ${match?.[0].trim()}`
		);
	}
}
