export default (value: string, max: number) => typeof value === 'string' && value.length <= max;
