export default function message(input: (string | null | undefined)[] = []) {
	return input.filter(Boolean).join(' ');
}
