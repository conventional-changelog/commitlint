export default function toLines(input) {
	if (typeof input !== 'string') {
		return [];
	}

	return input.split(/(?:\r?\n)/);
}
