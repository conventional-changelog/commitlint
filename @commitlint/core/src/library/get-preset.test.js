import test from 'ava';
import getPreset from './get-preset';

function require(id) {
	if (id !== 'conventional-changelog-existing') {
		throw new Error(`Module "${id}" not found.`);
	}
	return true;
}

test('throws when called without params', t => {
	t.throws(() => getPreset(), Error);
});

test('throws when called for non-existing module', t => {
	t.throws(() => getPreset('non-existing', require), Error);
});

test('return module when called for existing module', async t => {
	const actual = await getPreset('existing', require);
	t.is(actual, true);
});
