export default message;

function message(input: any[] = []) {
	return input.filter(Boolean).join(' ');
}
