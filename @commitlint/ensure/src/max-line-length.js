import ensure from './max-length';

export default (value, max) =>
	typeof value === 'string' &&
	value.split(/\r?\n/).every(line => ensure(line, max));
