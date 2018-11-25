const addModuleExports = require('babel-plugin-add-module-exports');
const fastAsync = require('fast-async');
const jsx = require('babel-plugin-transform-react-jsx');
const transformRuntime = require('babel-plugin-transform-runtime').default;
const env = require('babel-preset-env').default;

module.exports = preset;

function preset() {
	const plugins = [
		addModuleExports,
		[jsx, {pragma: 'h'}],
		[fastAsync, {spec: true}],
		[transformRuntime, {polyfill: false, regenerator: false}]
	];

	return {
		env: {
			development: {
				plugins
			}
		},
		plugins,
		presets: [
			[
				env,
				{
					debug: process.env.DEBUG === 'true',
					exclude: ['transform-regenerator', 'transform-async-to-generator'],
					targets: {node: '6'}
				}
			]
		]
	};
}
