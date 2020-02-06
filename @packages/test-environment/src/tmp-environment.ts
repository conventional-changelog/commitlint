// https://github.com/raszi/node-tmp/issues/229

import NodeEnvironment from 'jest-environment-node';
import tmp from 'tmp';

tmp.setGracefulCleanup();

class TmpEnvironment extends NodeEnvironment {
	async setup() {
		await super.setup();

		this.global.tmp = tmp;
	}
}

export default TmpEnvironment;
