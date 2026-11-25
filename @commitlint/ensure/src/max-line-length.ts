import ensure from "./max-length.js";

// Allow an exception for long lines which contain URLs or email addresses
// (such as Co-Authored-By trailers).
//
// These checks are intentionally simple, in order to avoid costly regexps
// which have to worry about all the many edge cases of valid URLs and emails.
const URL_REGEX = /\bhttps?:\/\/\S+/;
const TOKEN_SEPARATOR_REGEX = /[\s<>"(),;:!?`]+/;
const EMAIL_REGEX =
	/^[a-z0-9!#$%&'*+=?^_{|}~[\]-]+(?:\.[a-z0-9!#$%&'*+=?^_{|}~[\]-]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:[a-z]{2,}|xn--[a-z0-9]+(?:-+[a-z0-9]+)*)$/i;

function trimEdgePunctuation(token: string): string {
	let start = 0;
	let end = token.length;

	while (start < end && (token[start] === "'" || token[start] === "[")) {
		start++;
	}

	while (
		end > start &&
		(token[end - 1] === "'" || token[end - 1] === "]" || token[end - 1] === ".")
	) {
		end--;
	}

	return token.slice(start, end);
}

function hasEmail(line: string): boolean {
	if (!line.includes("@")) {
		return false;
	}

	return line
		.split(TOKEN_SEPARATOR_REGEX)
		.some((token) => token.includes("@") && EMAIL_REGEX.test(trimEdgePunctuation(token)));
}

export default (value: string, max: number): boolean =>
	typeof value === "string" &&
	value.split(/\r?\n/).every((line) => ensure(line, max) || URL_REGEX.test(line) || hasEmail(line));
