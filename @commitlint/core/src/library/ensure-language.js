import franc from 'franc';

export default (input, allowed) => {
	const detected = franc
		.all(input)
		.filter(lang => lang[1] >= 0.45)
		.map(lang => lang[0])
		.slice(0, 5);

	// Library franc spits out ['und'] when unable to
	// guess any languages, let it through in this case
	const matches = detected[0] === 'und' || detected.indexOf(allowed) > -1;

	return {
		matches,
		detected
	};
};
