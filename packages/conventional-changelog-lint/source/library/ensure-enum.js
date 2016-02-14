export default (value, enums) => {
	return enums.length === 0 || enums.indexOf(value) > -1;
};
