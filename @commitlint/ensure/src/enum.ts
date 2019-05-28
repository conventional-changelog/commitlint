export default (value: any, enums: any[] = []): boolean => {
	if (value === undefined) {
		return false;
	}
	if (!Array.isArray(enums)) {
		return false;
	}
	return enums.indexOf(value) > -1;
};
