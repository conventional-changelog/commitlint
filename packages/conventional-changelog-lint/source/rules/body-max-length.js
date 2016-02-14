import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	return [
		ensureMaxLength(parsed.body, value),
		`body must not be longer than ${value} characters`
	];
};
