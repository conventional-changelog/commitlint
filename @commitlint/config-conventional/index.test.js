import lint from '@commitlint/lint';
import {rules, parserPreset} from '.';

const commitLint = async (message) => {
	const preset = await require(parserPreset)();
	return lint(message, rules, {...preset});
};

const messages = {
	invalidTypeEnum: 'foo: some message',
	invalidTypeCase: 'FIX: some message',
	invalidTypeEmpty: ': some message',
	invalidSubjectCases: [
		'fix(scope): Some message',
		'fix(scope): Some Message',
		'fix(scope): SomeMessage',
		'fix(scope): SOMEMESSAGE',
	],
	invalidSubjectEmpty: 'fix:',
	invalidSubjectFullStop: 'fix: some message.',
	invalidHeaderMaxLength:
		'fix: some message that is way too long and breaks the line max-length by several characters since the max is 100',
	warningFooterLeadingBlank:
		'fix: some message\n\nbody\nBREAKING CHANGE: It will be significant',
	invalidFooterMaxLineLength:
		'fix: some message\n\nbody\n\nBREAKING CHANGE: footer with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters',
	warningBodyLeadingBlank: 'fix: some message\nbody',
	invalidBodyMaxLineLength:
		'fix: some message\n\nbody with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters',
	validMessages: [
		'fix: some message',
		'fix(scope): some message',
		'fix(scope): some Message',
		'fix(scope): some message\n\nBREAKING CHANGE: it will be significant!',
		'fix(scope): some message\n\nbody',
		'fix(scope)!: some message\n\nbody',
	],
};

const errors = {
	typeEnum: {
		level: 2,
		message:
			'type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]',
		name: 'type-enum',
		valid: false,
	},
	typeCase: {
		level: 2,
		message: 'type must be lower-case',
		name: 'type-case',
		valid: false,
	},
	typeEmpty: {
		level: 2,
		message: 'type may not be empty',
		name: 'type-empty',
		valid: false,
	},
	subjectCase: {
		level: 2,
		message:
			'subject must not be sentence-case, start-case, pascal-case, upper-case',
		name: 'subject-case',
		valid: false,
	},
	subjectEmpty: {
		level: 2,
		message: 'subject may not be empty',
		name: 'subject-empty',
		valid: false,
	},
	subjectFullStop: {
		level: 2,
		message: 'subject may not end with full stop',
		name: 'subject-full-stop',
		valid: false,
	},
	headerMaxLength: {
		level: 2,
		message:
			'header must not be longer than 100 characters, current length is 112',
		name: 'header-max-length',
		valid: false,
	},
	footerMaxLineLength: {
		level: 2,
		message: "footer's lines must not be longer than 100 characters",
		name: 'footer-max-line-length',
		valid: false,
	},
	bodyMaxLineLength: {
		level: 2,
		message: "body's lines must not be longer than 100 characters",
		name: 'body-max-line-length',
		valid: false,
	},
};

const warnings = {
	footerLeadingBlank: {
		level: 1,
		message: 'footer must have leading blank line',
		name: 'footer-leading-blank',
		valid: false,
	},
	bodyLeadingBlank: {
		level: 1,
		message: 'body must have leading blank line',
		name: 'body-leading-blank',
		valid: false,
	},
};

test('type-enum', async () => {
	const result = await commitLint(messages.invalidTypeEnum);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.typeEnum]);
});

test('type-case', async () => {
	const result = await commitLint(messages.invalidTypeCase);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.typeCase, errors.typeEnum]);
});

test('type-empty', async () => {
	const result = await commitLint(messages.invalidTypeEmpty);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.typeEmpty]);
});

test('subject-case', async () => {
	const invalidInputs = await Promise.all(
		messages.invalidSubjectCases.map((invalidInput) => commitLint(invalidInput))
	);

	invalidInputs.forEach((result) => {
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([errors.subjectCase]);
	});
});

test('subject-empty', async () => {
	const result = await commitLint(messages.invalidSubjectEmpty);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.subjectEmpty, errors.typeEmpty]);
});

test('subject-full-stop', async () => {
	const result = await commitLint(messages.invalidSubjectFullStop);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.subjectFullStop]);
});

test('header-max-length', async () => {
	const result = await commitLint(messages.invalidHeaderMaxLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.headerMaxLength]);
});

test('footer-leading-blank', async () => {
	const result = await commitLint(messages.warningFooterLeadingBlank);

	expect(result.valid).toBe(true);
	expect(result.warnings).toEqual([warnings.footerLeadingBlank]);
});

test('footer-max-line-length', async () => {
	const result = await commitLint(messages.invalidFooterMaxLineLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.footerMaxLineLength]);
});

test('body-leading-blank', async () => {
	const result = await commitLint(messages.warningBodyLeadingBlank);

	expect(result.valid).toBe(true);
	expect(result.warnings).toEqual([warnings.bodyLeadingBlank]);
});

test('body-max-line-length', async () => {
	const result = await commitLint(messages.invalidBodyMaxLineLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.bodyMaxLineLength]);
});

test('valid messages', async () => {
	const validInputs = await Promise.all(
		messages.validMessages.map((input) => commitLint(input))
	);

	validInputs.forEach((result) => {
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
	});
});
