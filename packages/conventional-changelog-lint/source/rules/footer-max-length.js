import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	return [
		ensureMaxLength(parsed.footer, value),
		`footer must not be longer than ${value} characters`
	];
};
