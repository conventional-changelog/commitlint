export default (value: string, max: number): boolean => typeof value === 'string' && value.length <= max;
