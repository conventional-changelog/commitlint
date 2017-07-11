import {Lexer, Tagger} from 'pos';
import {entries} from 'lodash';

const lexer = new Lexer();
const tagger = new Tagger();

const tenses = {
	'past-tense': ['VB', 'VBD'],
	'present-imperative': ['VB', 'VBN', 'VBP'],
	'present-participle': ['VB', 'VBG'],
	'present-third-person': ['VB', 'VBZ']
};

function getLemmata(input) {
	try {
		return lexer.lex(input);
	} catch (err) {
		return [];
	}
}

function getTags(lemmata) {
	try {
		return tagger.tag(lemmata);
	} catch (err) {
		return [];
	}
}

export default (input, allowed, options = {}) => {
	const lemmata = getLemmata(input);
	const tagged = getTags(lemmata);
	const verbs = tagged.filter(tag => tag[1][0] === 'V');
	const tags = allowed.reduce((registry, name) => {
		return [...registry, ...(tenses[name] || [])];
	}, []);

	const offending = verbs
		.filter(verb => {
			const [, tag] = verb;
			return tags.length > 0 && tags.indexOf(tag) === -1;
		})
		.filter(verb => {
			const [word] = verb;
			return !(options.ignored || [])
				.some(ignored => ignored.indexOf(word) > -1);
		})
		.filter(Boolean)
		.map(verb => {
			const [lemma, tag] = verb;
			const tense = entries(tenses)
				.filter(item => {
					const [, tags] = item;
					return tags.indexOf(tag) > -1;
				})
				.map(item => item[0])[0];

			return {
				lemma,
				tense
			};
		});

	return {
		matches: offending.length === 0,
		offending
	};
};
