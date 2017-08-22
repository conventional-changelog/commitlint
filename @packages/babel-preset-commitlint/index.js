const addModuleExporst = require('babel-plugin-add-module-exports');
const fastAsync = require('fast-async');
const istanbul = require('babel-plugin-istanbul');
const transformRuntime = require('babel-plugin-transform-runtime');
const env = require('babel-preset-env');

module.exports = preset;

function preset() {
	const plugins = [
		addModuleExporst,
		[fastAsync, {spec: true}],
		[transformRuntime, {polyfill: false, regenerator: false}]
	];

	return {
		env: {
			development: {
				plugins: plugins.concat([istanbul])
			}
		},
		plugins,
		presets: [
			[env, {
				exclude: ['transform-regenerator', 'transform-async-to-generator'],
				target: {node: 4},
				useBuiltins: true
			}]
		],
	};
}
