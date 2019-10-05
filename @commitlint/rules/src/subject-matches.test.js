import test from 'ava';
import parse from '@commitlint/parse';
import check from './subject-matches';

const parsed = parse('feat(scope): Header. #42\n');
const pattern = '^[A-Z]{1}.+\\.(\\s#\\d+)?$';

test('checks subject against "always match" rule', async t => {
	const [actual] = check(await parsed, 'always', pattern);
	const expected = true;
	t.is(actual, expected);
});

test('checks subject against "never match" rule', async t => {
	const [actual] = check(await parsed, 'never', pattern);
	const expected = false;
	t.is(actual, expected);
});
