export default function toLines(input?: string | null): string[] {
	if (typeof input !== 'string') {
		return [];
	}

	return input.split(/(?:\r?\n)/);
}
