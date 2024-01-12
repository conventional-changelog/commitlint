// https://github.com/raszi/node-tmp/issues/229
import {TestEnvironment as NodeEnvironment} from 'jest-environment-node';
import tmp from 'tmp';

class TestEnvironment extends NodeEnvironment {
	async setup() {
		await super.setup();

		tmp.setGracefulCleanup();

		this.global.tmp = tmp;
	}
}

export default TestEnvironment;
