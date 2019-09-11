export default (value: string): boolean =>
	typeof value === 'string' && value.length > 0;
