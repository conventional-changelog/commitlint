import ensure from "./max-length.js";

// Allow an exception for long lines which contain URLs.
//
// This is overly lenient, in order to avoid costly regexps which
// have to worry about all the many edge cases of valid URLs.
const URL_REGEX = /\bhttps?:\/\/\S+/;

export default (value: string, max: number): boolean =>
	typeof value === "string" &&
	value
		.split(/\r?\n/)
		.every((line) => URL_REGEX.test(line) || ensure(line, max));
