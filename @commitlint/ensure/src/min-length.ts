export default (value: string, min: number) => typeof value === 'string' && value.length >= min;
