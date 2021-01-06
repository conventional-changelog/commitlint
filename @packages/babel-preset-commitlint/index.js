const env = require('@babel/preset-env');
const jsx = require('@babel/plugin-transform-react-jsx');
const commonjs = require('@babel/plugin-transform-modules-commonjs');
const transformRuntime = require('@babel/plugin-transform-runtime');

module.exports = preset;

function preset() {
	const plugins = [
		commonjs,
		[jsx, {pragma: 'h'}],
		[transformRuntime, {regenerator: false}],
	];

	return {
		env: {
			development: {
				plugins,
			},
		},
		plugins,
		presets: [
			[
				env,
				{
					debug: process.env.DEBUG === 'true',
					targets: {node: '10'},
					modules: false,
				},
			],
		],
	};
}
