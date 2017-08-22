const addModuleExports = require('babel-plugin-add-module-exports').default;
const fastAsync = require('fast-async').default;
const istanbul = require('babel-plugin-istanbul').default;
const transformRuntime = require('babel-plugin-transform-runtime').default;
const env = require('babel-preset-env').default;

module.exports = preset;

function preset() {
	const plugins = [
		addModuleExports,
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
