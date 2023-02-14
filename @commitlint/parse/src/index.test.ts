import parse from '.';

test('throws when called without params', async () => {
	await expect((parse as any)()).rejects.toThrowError('Expected a raw commit');
});

test('throws when called with empty message', async () => {
	await expect(parse('')).rejects.toThrowError('Expected a raw commit');
});

test('returns object with raw message', async () => {
	const message = 'type(scope): subject';
	const actual = await parse(message);

	expect(actual).toHaveProperty('raw', message);
});

test('calls parser with message and passed options', async () => {
	const message = 'message';

	expect.assertions(1);
	await parse(message, (m: string): any => {
		expect(m).toBe(message);
		return {};
	});
});

test('passes object up from parser function', async () => {
	const message = 'message';
	const result: any = {};
	const actual = await parse(message, () => result);

	expect(actual).toBe(result);
});

test('returns object with expected keys', async () => {
	const message = 'message';
	const actual = await parse(message);
	const expected = {
		body: null,
		footer: null,
		header: 'message',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'message',
		references: [],
		revert: null,
		scope: null,
		subject: null,
		type: null,
	};

	expect(actual).toMatchObject(expected);
});

test('uses angular grammar', async () => {
	const message = 'type(scope): subject';
	const actual = await parse(message);
	const expected = {
		body: null,
		footer: null,
		header: 'type(scope): subject',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'type(scope): subject',
		references: [],
		revert: null,
		scope: 'scope',
		subject: 'subject',
		type: 'type',
	};

	expect(actual).toMatchObject(expected);
});

test('uses custom opts parser', async () => {
	const message = 'type(scope)-subject';
	const changelogOpts = {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
		},
	};
	const actual = await parse(message, undefined, changelogOpts.parserOpts);
	const expected = {
		body: null,
		footer: null,
		header: 'type(scope)-subject',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'type(scope)-subject',
		references: [],
		revert: null,
		scope: 'scope',
		subject: 'subject',
		type: 'type',
	};

	expect(actual).toMatchObject(expected);
});

test('does not merge array properties with custom opts', async () => {
	const message = 'type: subject';
	const actual = await parse(message, undefined, {
		headerPattern: /^(.*):\s(.*)$/,
		headerCorrespondence: ['type', 'subject'],
	});
	const expected = {
		body: null,
		footer: null,
		header: 'type: subject',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'type: subject',
		references: [],
		revert: null,
		subject: 'subject',
		type: 'type',
	};

	expect(actual).toMatchObject(expected);
});

test('supports scopes with /', async () => {
	const message = 'type(some/scope): subject';
	const actual = await parse(message);

	expect(actual.scope).toBe('some/scope');
	expect(actual.subject).toBe('subject');
});

test('supports scopes with / and empty parserOpts', async () => {
	const message = 'type(some/scope): subject';
	const actual = await parse(message, undefined, {});

	expect(actual.scope).toBe('some/scope');
	expect(actual.subject).toBe('subject');
});

test('ignores comments', async () => {
	const message = 'type(some/scope): subject\n# some comment';
	const changelogOpts = await require('conventional-changelog-angular');
	const opts = {
		...changelogOpts.parserOpts,
		commentChar: '#',
	};
	const actual = await parse(message, undefined, opts);

	expect(actual.body).toBe(null);
	expect(actual.footer).toBe(null);
	expect(actual.subject).toBe('subject');
});

test('registers inline #', async () => {
	const message =
		'type(some/scope): subject #reference\n# some comment\nthings #reference';
	const changelogOpts = await require('conventional-changelog-angular');
	const opts = {
		...changelogOpts.parserOpts,
		commentChar: '#',
	};
	const actual = await parse(message, undefined, opts);

	expect(actual.subject).toBe('subject #reference');
	expect(actual.body).toBe('things #reference');
});

test('keep -side notes- in the body section', async () => {
	const header = 'type(some/scope): subject';
	const body =
		'CI on master branch caught this:\n\n' +
		'```\n' +
		'Unhandled Exception:\n' +
		"System.AggregateException: One or more errors occurred. (Some problem when connecting to 'api.mycryptoapi.com/eth')\n\n" +
		'--- End of stack trace from previous location where exception was thrown ---\n\n' +
		'at GWallet.Backend.FSharpUtil.ReRaise (System.Exception ex) [0x00000] in /Users/runner/work/geewallet/geewallet/src/GWallet.Backend/FSharpUtil.fs:206\n' +
		'...\n' +
		'```';

	const message = header + '\n\n' + body;

	const actual = await parse(message);

	expect(actual.body).toBe(body);
});

test('allows separating -side nodes- by setting parserOpts.fieldPattern', async () => {
	const message =
		'type(scope): subject\n\nbody text\n-authorName-\nrenovate[bot]';
	const changelogOpts = {
		parserOpts: {
			fieldPattern: /^-(.*)-$/,
		},
	};
	const actual = await parse(message, undefined, changelogOpts.parserOpts);

	expect(actual.body).toBe('body text');
	expect(actual).toHaveProperty('authorName', 'renovate[bot]');
});

test('parses references leading subject', async () => {
	const message = '#1 some subject';
	const opts = await require('conventional-changelog-angular');
	const {
		references: [actual],
	} = await parse(message, undefined, opts);

	expect(actual.issue).toBe('1');
});

test('parses custom references', async () => {
	const message = '#1 some subject PREFIX-2';
	const {references} = await parse(message, undefined, {
		issuePrefixes: ['PREFIX-'],
	});

	expect(references.find((ref) => ref.issue === '1')).toBeFalsy();
	expect(references.find((ref) => ref.issue === '2')).toMatchObject({
		action: null,
		issue: '2',
		owner: null,
		prefix: 'PREFIX-',
		raw: '#1 some subject PREFIX-2',
		repository: null,
	});
});

test('uses permissive default regex without parser opts', async () => {
	const message = 'chore(component,demo): bump';
	const actual = await parse(message);

	expect(actual.scope).toBe('component,demo');
});

test('uses permissive default regex with other parser opts', async () => {
	const message = 'chore(component,demo): bump';
	const actual = await parse(message, undefined, {commentChar: '#'});

	expect(actual.scope).toBe('component,demo');
});

test('uses restrictive default regex in passed parser opts', async () => {
	const message = 'chore(component,demo): bump';
	const actual = await parse(message, undefined, {
		headerPattern: /^(\w*)(?:\(([a-z]*)\))?: (.*)$/,
	});

	expect(actual.subject).toBe(null);
	expect(actual.scope).toBe(null);
});

test('works with chinese scope by default', async () => {
	const message = 'fix(面试评价): 测试';
	const actual = await parse(message, undefined, {commentChar: '#'});

	expect(actual.subject).not.toBe(null);
	expect(actual.scope).not.toBe(null);
});

test('does not work with chinese scopes with incompatible pattern', async () => {
	const message = 'fix(面试评价): 测试';
	const actual = await parse(message, undefined, {
		headerPattern: /^(\w*)(?:\(([a-z]*)\))?: (.*)$/,
	});

	expect(actual.subject).toBe(null);
	expect(actual.scope).toBe(null);
});
