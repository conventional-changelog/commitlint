export default (a, stringCase) => {
	const method = `to${stringCase[0].toUpperCase()}${stringCase.slice(1)}`;
	return typeof a !== 'string' || a[method]() === a;
};
