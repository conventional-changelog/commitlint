import test from 'ava';
import resolveExtends from './resolve-extends';

const _ = undefined;

test('returns empty object when called without params', t => {
	const actual = resolveExtends();
	t.deepEqual(actual, {});
});

test('returns an equivalent object as passed in', t => {
	const expected = {foo: 'bar'};
	const actual = resolveExtends(expected);
	t.deepEqual(actual, expected);
});

test('uses empty prefix by default', t => {
	const input = {extends: ['extender-name']};

	resolveExtends(input, _, _, id => {
		t.is(id, 'extender-name');
	});
});

test('uses prefix as configured', t => {
	const input = {extends: ['extender-name']};

	resolveExtends(input, 'prefix', _, id => {
		t.is(id, 'prefix-extender-name');
	});
});

test('uses extends key as configured', t => {
	const input = {inherit: ['extender-name'], extends: ['fails']};

	resolveExtends(input, _, 'inherit', id => {
		t.is(id, 'extender-name');
	});
});

test('propagates return value of require function', t => {
	const input = {extends: ['extender-name']};
	const propagated = {foo: 'bar'};

	const actual = resolveExtends(input, _, _, () => {
		return propagated;
	});

	t.is(actual.foo, 'bar');
});

test('resolves extends recursively', t => {
	const input = {extends: ['extender-name']};
	const actual = [];

	resolveExtends(input, _, _, id => {
		actual.push(id);
		if (id === 'extender-name') {
			return {extends: ['recursive-extender-name']};
		}
		if (id === 'recursive-extender-name') {
			return {foo: 'bar'};
		}
	});

	t.deepEqual(actual, ['extender-name', 'recursive-extender-name']);
});

test('uses prefix key recursively', t => {
	const input = {extends: ['extender-name']};
	const actual = [];

	resolveExtends(input, 'prefix', _, id => {
		actual.push(id);
		if (id === 'prefix-extender-name') {
			return {extends: ['recursive-extender-name']};
		}
		if (id === 'prefix-recursive-extender-name') {
			return {foo: 'bar'};
		}
	});

	t.deepEqual(actual, ['prefix-extender-name', 'prefix-recursive-extender-name']);
});

test('uses extends key recursively', t => {
	const input = {inherit: ['extender-name']};
	const actual = [];

	resolveExtends(input, _, 'inherit', id => {
		actual.push(id);
		if (id === 'extender-name') {
			return {inherit: ['recursive-extender-name']};
		}
		if (id === 'recursive-extender-name') {
			return {foo: 'bar'};
		}
	});

	t.deepEqual(actual, ['extender-name', 'recursive-extender-name']);
});

test('propagates contents recursively', t => {
	const input = {extends: ['extender-name']};

	const actual = resolveExtends(input, _, _, id => {
		if (id === 'extender-name') {
			return {extends: ['recursive-extender-name'], foo: 'bar'};
		}
		if (id === 'recursive-extender-name') {
			return {baz: 'bar'};
		}
	});

	const expected = {
		extends: ['extender-name'],
		foo: 'bar',
		baz: 'bar'
	};

	t.deepEqual(actual, expected);
});

test('extending contents should take precedence', t => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const actual = resolveExtends(input, _, _, id => {
		if (id === 'extender-name') {
			return {extends: ['recursive-extender-name'], zero: id, one: id};
		}
		if (id === 'recursive-extender-name') {
			return {extends: ['second-recursive-extender-name'], zero: id, one: id, two: id};
		}
		if (id === 'second-recursive-extender-name') {
			return {zero: id, one: id, two: id, three: id};
		}
	});

	const expected = {
		extends: ['extender-name'],
		zero: 'root',
		one: 'extender-name',
		two: 'recursive-extender-name',
		three: 'second-recursive-extender-name'
	};

	t.deepEqual(actual, expected);
});
