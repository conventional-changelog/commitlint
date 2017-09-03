import path from 'path';
import importFrom from 'import-from';
import {entries, merge, mergeWith, pick} from 'lodash';
import rc from 'rc';
import resolveFrom from 'resolve-from';

import resolveExtends from './library/resolve-extends';
import executeRule from './library/execute-rule';

const w = (a, b) => (Array.isArray(b) ? b : undefined);
const valid = input => pick(input, 'extends', 'rules', 'parserPreset');

export default async (seed = {}) => {
	// Obtain config from .rc files
	const raw = file();

	// Merge passed config with file based options
	const config = valid(merge(raw, seed));
	const opts = merge({extends: [], rules: {}}, pick(config, 'extends'));

	// Resolve parserPreset key
	if (typeof config.parserPreset === 'string') {
		const resolvedParserPreset = resolveFrom(process.cwd(), config.parserPreset);

		config.parserPreset = {
			name: config.parserPreset,
			path: `./${path.posix.relative(process.cwd(), resolvedParserPreset)}`.split(path.sep).join('/'),
			opts: require(resolvedParserPreset)
		};
	}

	// Resolve extends key
	const extended = resolveExtends(opts, {
		prefix: 'commitlint-config',
		cwd: raw.config ? path.dirname(raw.config) : process.cwd(),
		parserPreset: config.parserPreset
	});

	const preset = valid(mergeWith(extended, config, w));

	// Await parser-preset if applicable
	if (typeof preset.parserPreset === 'object' && typeof preset.parserPreset.opts === 'object') {
		preset.parserPreset.opts = await preset.parserPreset.opts;
	}

	// Execute rule config functions if needed
	const executed = await Promise.all(
		['rules']
			.map(key => {
				return [key, preset[key]];
			})
			.map(async item => {
				const [key, value] = item;
				const executedValue = await Promise.all(
					entries(value || {}).map(entry => executeRule(entry))
				);
				return [
					key,
					executedValue.reduce((registry, item) => {
						const [key, value] = item;
						registry[key] = value;
						return registry;
					}, {})
				];
			})
	);

	// Merge executed config keys into preset
	return executed.reduce((registry, item) => {
		const [key, value] = item;
		registry[key] = value;
		return registry;
	}, preset);
};

function file() {
	const legacy = rc('conventional-changelog-lint');
	const legacyFound = typeof legacy.config === 'string';

	const found = resolveable('./commitlint.config');
	const raw = found ? importFrom(process.cwd(), './commitlint.config') : {};

	if (legacyFound && !found) {
		console.warn(
			`Using legacy ${path.relative(
				process.cwd(),
				legacy.config
			)}. Rename to commitlint.config.js to silence this warning.`
		);
	}

	if (legacyFound && found) {
		console.warn(
			`Ignored legacy ${path.relative(
				process.cwd(),
				legacy.config
			)} as commitlint.config.js superseeds it. Remove .conventional-changelog-lintrc to silence this warning.`
		);
	}

	if (found) {
		return raw;
	}

	return legacy;
}

function resolveable(id) {
	try {
		resolveFrom(process.cwd(), id);
		return true;
	} catch (err) {
		return false;
	}
}
