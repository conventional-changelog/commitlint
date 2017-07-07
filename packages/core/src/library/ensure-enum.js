export default (value, enums = []) => {
	if (value === undefined) {
		return false;
	}
	if (!Array.isArray(enums)) {
		return false;
	}
	return enums.indexOf(value) > -1;
};
