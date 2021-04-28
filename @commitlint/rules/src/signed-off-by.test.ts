import parse from '@commitlint/parse';
import {signedOffBy} from './signed-off-by';

const messages = {
	empty: 'test:\n',
	with: `test: subject\n\nbody\n\nfooter\n\nSigned-off-by:\n\n`,
	without: `test: subject\n\nbody\n\nfooter\n\n`,
	inSubject: `test: subject Signed-off-by:\n\nbody\n\nfooter\n\n`,
	inBody: `test: subject\n\nbody Signed-off-by:\n\nfooter\n\n`,
	withSignoffAndNoise: `test: subject

message body

Arbitrary-trailer:
Signed-off-by:
Another-arbitrary-trailer:

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
	withSignoffAndNoise: parse(messages.withSignoffAndNoise),
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
		'Signed-off-by:'
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.without, 'never', 'Signed-off-by:');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('comments and other trailers should be ignored', async () => {
	const [actual] = signedOffBy(
		await parsed.withSignoffAndNoise,
		'always',
		'Signed-off-by:'
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('inSubject against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(
		await parsed.inSubject,
		'always',
		'Signed-off-by:'
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('inSubject against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(
		await parsed.inSubject,
		'never',
		'Signed-off-by:'
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
