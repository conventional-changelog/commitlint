export default function toLines(input) {
	if (typeof input === 'undefined') {
		return [];
	}

	return input.split(/(?:\r?\n)/);
}
