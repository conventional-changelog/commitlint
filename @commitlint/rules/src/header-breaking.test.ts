import parse from '@commitlint/parse';
import {headerBreaking} from './header-breaking';

const messages = {
	empty: 'test: \nbody',
	filled: 'BREAKING CHANGE: this one',
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test('without subject should succeed', async () => {
	const [actual] = headerBreaking(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('BREAKING CHANGE: in header should fail', async () => {
	const [actual] = headerBreaking(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});
