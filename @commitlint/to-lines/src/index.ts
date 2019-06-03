export default function toLines(input: string): string[] {
	if (typeof input !== 'string') {
		return [];
	}

	return input.split(/(?:\r?\n)/);
}
