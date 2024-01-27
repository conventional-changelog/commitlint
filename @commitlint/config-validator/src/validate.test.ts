import {RuleConfigSeverity, UserConfig} from '@commitlint/types';

import {validateConfig} from './validate.js';

const validSchemas: Record<string, UserConfig> = {
	empty: {},
	withEmptyExtends: {extends: []},
	withStringExtends: {extends: 'test'},
	withSingleExtends: {extends: ['test']},
	withMultipleExtends: {extends: ['test', 'test2']},
	withFormatter: {formatter: ''},
	withHelpUrl: {helpUrl: ''},
	withRules: {
		rules: {
			a: [RuleConfigSeverity.Disabled],
			b: [RuleConfigSeverity.Warning, 'never'],
			c: [RuleConfigSeverity.Error, 'never', true],
		},
	},
	withParserPresetString: {parserPreset: 'test'},
	withParserPresetObject: {parserPreset: {}},
	withParserPresetObject2: {parserPreset: {name: 'string', path: 'string'}},
	withParserPresetObjectPromise: {
		parserPreset: Promise.resolve({name: 'string'}),
	},
	withParserPresetOpts: {parserPreset: {parserOpts: {test: 1}}},
	withParserPresetOptsPromise: {
		parserPreset: {parserOpts: Promise.resolve({test: 1})},
	},
	withEmptyIgnores: {ignores: []},
	withIgnores: {ignores: [() => true]},
	withDefaultIgnoresTrue: {defaultIgnores: true},
	withDefaultIgnoresFalse: {defaultIgnores: false},
	withEmptyPlugins: {plugins: []},
	withPluginsAsString: {plugins: ['test']},
	withPluginsAsObject: {plugins: [{rules: {}}]},
	shouldSkipAllowAdditionalProperties: {foo: 1},
};

const invalidSchemas: Record<string, any> = {
	whenConfigIsNotObject: [],
	whenConfigIsNotObject2: '',
	extendsAsObject: {extends: {test: 1}},
	extendsWithFunction: {extends: [() => true]},
	formatterAsObject: {formatter: {}},
	helpUrlAsArray: {helpUrl: []},
	rulesAsArray: {rules: ['a']},
	rules1: {rules: {a: [3]}},
	rules2: {rules: {b: [1, 'test', 2, 2]}},
	rules3: {rules: {c: []}},
	rules4: {rules: {d: [[], [], []]}},
	rules5: {rules: {e: {}}},
	parserPreset: {parserPreset: []},
	ignoresFunction: {ignores: () => true},
	ignoresNotFunction: {ignores: [1]},
	defaultIgnoresNotBoolean: {defaultIgnores: 'true'},
	pluginsNotArray: {plugins: 'test'},
	withPluginsAsObject: {plugins: [{}]},
	helpUrlNotString: {helpUrl: {}},
};

describe('validation should pass for', () => {
	test.each(Object.entries(validSchemas))('%s', (file, config) => {
		expect(() => validateConfig(`${file}.js`, config)).not.toThrow();
	});
});

describe('validation should fail for', () => {
	test.each(Object.entries(invalidSchemas))('%s', (file, config) => {
		expect(() =>
			validateConfig(`${file}.js`, config)
		).toThrowErrorMatchingSnapshot();
	});
});
