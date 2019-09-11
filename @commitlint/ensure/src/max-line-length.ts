import ensure from './max-length';

export default (value: string, max: number): boolean =>
	typeof value === 'string' &&
	value.split(/\r?\n/).every(line => ensure(line, max));
