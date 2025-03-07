export default (value: string | null, min: number): boolean =>
	typeof value === 'string' && value.length >= min;
