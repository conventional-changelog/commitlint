import ensure from "./max-length.js";

// Allow an exception for long lines which contain URLs or trailer lines with
// email addresses (such as Co-authored-by or Signed-off-by).
//
// These regexes are intentionally simple, in order to avoid costly regexps
// which have to worry about all the many edge cases of valid URLs and emails.
const URL_REGEX = /\bhttps?:\/\/\S+/;
const TRAILER_EMAIL_REGEX = /^[\w-]+:\s.*<[^<>\s@]+@[^<>\s@]+>\s*$/;

export default (value: string, max: number): boolean =>
	typeof value === "string" &&
	value
		.split(/\r?\n/)
		.every((line) => ensure(line, max) || URL_REGEX.test(line) || TRAILER_EMAIL_REGEX.test(line));
