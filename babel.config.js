// This file is required by babel-jest
module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				debug: process.env.DEBUG === 'true',
				targets: {node: '10'},
			},
		],
	],
};
