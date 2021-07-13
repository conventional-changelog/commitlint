export default (value: any, enums: any[] = []): boolean => {
	if (value === undefined) {
		return false;
	}
	if (!Array.isArray(enums)) {
		return false;
	}
	return enums.reduce((last, curr) => {
		if (curr instanceof RegExp) {
			return last || value.search(curr) !== -1;
		} else {
			return last || value === curr;
		}
	}, false);
};
