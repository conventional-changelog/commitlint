export default (raw = '', target = 'lowercase') => {
	const normalized = String(raw);

	switch (target) {
		case 'uppercase':
			return normalized.toUpperCase() === normalized;
		case 'lowercase':
		default:
			return normalized.toLowerCase() === normalized;
	}
};
