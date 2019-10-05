import test from 'ava';
import parse from '@commitlint/parse';
import check from './header-matches';

const parsed = parse('Header. #42\n');
const pattern = '^[A-Z]{1}.+\\.(\\s#\\d+)?$';

test('checks header against "always match" rule', async t => {
	const [actual] = check(await parsed, 'always', pattern);
	const expected = true;
	t.is(actual, expected);
});

test('checks header against "never match" rule', async t => {
	const [actual] = check(await parsed, 'never', pattern);
	const expected = false;
	t.is(actual, expected);
});
