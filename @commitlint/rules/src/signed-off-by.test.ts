import parse from '@commitlint/parse';
import {signedOffBy} from './signed-off-by';

const messages = {
	empty: 'test:\n',
	with: `test: subject\nbody\nfooter\nSigned-off-by:\n\n`,
	without: `test: subject\nbody\nfooter\n\n`,
	inSubject: `test: subject Signed-off-by:\nbody\nfooter\n\n`,
	inBody: `test: subject\nbody Signed-off-by:\nfooter\n\n`,
	withSignoffAndComments: `test: subject

message body

Signed-off-by:

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
`,
};

const parsed = {
	empty: parse(messages.empty),
	with: parse(messages.with),
	without: parse(messages.without),
	inSubject: parse(messages.inSubject),
	inBody: parse(messages.inBody),
	withSignoffAndComments: parse(messages.withSignoffAndComments),
};

test('empty against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.empty, 'always', 'Signed-off-by:');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('empty against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.empty, 'never', 'Signed-off-by:');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "always signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.with, 'always', 'Signed-off-by:');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.with, 'never', 'Signed-off-by:');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(
		await parsed.without,
		'always',
		'Signed-off-by:',
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.without, 'never', 'Signed-off-by:');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('trailing comments should be ignored', async () => {
	const [actual] = signedOffBy(
		await parsed.withSignoffAndComments,
		'always',
		'Signed-off-by:',
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('inSubject against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(
		await parsed.inSubject,
		'always',
		'Signed-off-by:',
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('inSubject against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(
		await parsed.inSubject,
		'never',
		'Signed-off-by:',
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('inBody against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.inBody, 'always', 'Signed-off-by:');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('inBody against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.inBody, 'never', 'Signed-off-by:');
	const expected = true;
	expect(actual).toEqual(expected);
});
