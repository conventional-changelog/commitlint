export default message;

function message(input = []) {
	return input.filter(Boolean).join(' ');
}
