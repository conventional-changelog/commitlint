import {Answers, DistinctQuestion} from 'inquirer';
import wrap from 'word-wrap';
import Question from './Question';
import getRuleQuestionConfig from './services/getRuleQuestionConfig';
import {getRule} from './store/rules';
import getLeadingBlankFn from './utils/leading-blank-fn';
import {getMaxLength} from './utils/rules';

export function getQuestions(): Array<DistinctQuestion> {
	// body
	const questionConfig = getRuleQuestionConfig('body');

	if (!questionConfig) return [];
	else return [new Question('body', questionConfig).question];
}

export function combineCommitMessage(answers: Answers): string {
	const maxLineLength = getMaxLength(getRule('body', 'max-line-length'));
	const leadingBlankFn = getLeadingBlankFn(getRule('body', 'leading-blank'));
	const {body, breakingBody, issuesBody} = answers;

	const commitBody = body || breakingBody || issuesBody || '';

	if (commitBody) {
		return leadingBlankFn(
			maxLineLength < Infinity
				? wrap(commitBody, {
						width: maxLineLength,
						trim: true,
						indent: '',
				  })
				: commitBody.trim(),
		);
	} else {
		return '';
	}
}
