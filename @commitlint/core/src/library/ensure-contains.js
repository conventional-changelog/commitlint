export default (value, regex) => {
	if (value === undefined) {
		return false;
	}
	if (!(regex instanceof RegExp)) {
		return false;
	}
	return regex.test(value);
};
