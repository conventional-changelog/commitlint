export default message;

function message(input: (string | null | undefined)[] = []) {
	return input.filter(Boolean).join(' ');
}
