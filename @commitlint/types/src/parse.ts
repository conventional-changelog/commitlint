export interface Commit {
	raw: string;
	header: string;
	type: string | null;
	scope: string | null;
	subject: string | null;
	body: string | null;
	footer: string | null;
	mentions: string[];
	notes: CommitNote[];
	references: CommitReference[];
	revert: any;
	merge: any;
}

export interface CommitNote {
	title: string;
	text: string;
}

export interface CommitReference {
	raw: string;
	prefix: string;
	action: string | null;
	owner: string | null;
	repository: string | null;
	issue: string | null;
}

export type Parser = (
	message: string,
	options: ParserOptions,
) => Omit<Commit, 'raw'>;

export interface ParserOptions {
	commentChar?: string;
	fieldPattern?: RegExp;
	headerCorrespondence?: string[];
	headerPattern?: RegExp;
	issuePrefixes?: string[];
	mergeCorrespondence?: string[];
	mergePattern?: RegExp;
	noteKeywords?: string[];
	revertCorrespondence?: string[];
	revertPattern?: RegExp;
}
