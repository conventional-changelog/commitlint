// https://github.com/raszi/node-tmp/issues/229

const NodeEnvironment = require('jest-environment-node');
const tmp = require('tmp');

tmp.setGracefulCleanup();

class TmpEnvironment extends NodeEnvironment {
	async setup() {
		await super.setup();

		this.global.tmp = tmp;
	}
}

module.exports = TmpEnvironment;
