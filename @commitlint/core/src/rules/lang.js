export default (parsed, when, value) => {
	return [false, `rules.lang is deprecated. Received [${when}, ${value}]`];
};
