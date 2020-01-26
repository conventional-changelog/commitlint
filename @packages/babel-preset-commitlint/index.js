const fastAsync = require('fast-async');
const env = require('@babel/preset-env');
const jsx = require('@babel/plugin-transform-react-jsx');
const commonjs = require('@babel/plugin-transform-modules-commonjs');
const transformRuntime = require('@babel/plugin-transform-runtime');

module.exports = preset;

function preset() {
	const plugins = [
		commonjs,
		[jsx, {pragma: 'h'}],
		[fastAsync, {spec: true}],
		[transformRuntime, {regenerator: false}]
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
					targets: {node: '6'},
					modules: false
				}
			]
		]
	};
}
