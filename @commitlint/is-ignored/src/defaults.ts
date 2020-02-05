import * as semver from 'semver';
import {Matcher} from '@commitlint/types';

const isSemver = (c: string): boolean => {
	const firstLine = c.split('\n').shift();

	if (typeof firstLine !== 'string') {
		return false;
	}

	const stripped = firstLine.replace(/^chore(\([^)]+\))?:/, '').trim();
	return semver.valid(stripped) !== null;
};

const test = (r: RegExp): ((c: string) => boolean) => r.test.bind(r);

export const wildcards: Matcher[] = [
	test(
		/^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m
	),
	test(/^(R|r)evert (.*)/),
	test(/^(fixup|squash)!/),
	isSemver,
	test(/^Merged (.*?)(in|into) (.*)/),
	test(/^Merge remote-tracking branch (.*)/),
	test(/^Automatic merge(.*)/),
	test(/^Auto-merged (.*?) into (.*)/)
];
