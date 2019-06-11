export default (value: string, min: number): boolean =>
	typeof value === 'string' && value.length >= min;
