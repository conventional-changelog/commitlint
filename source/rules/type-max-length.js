import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	return [
		ensureMaxLength(parsed.type, value),
		`type must not be longer than ${value} characters`
	];
};
