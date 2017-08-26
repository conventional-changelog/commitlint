import defaultOpts from 'conventional-changelog-angular';

async function main() {
	const opts = await defaultOpts;
	opts.parserOpts.headerPattern = /^(\w*)(?:\((.*)\))?-(.*)$/;
	return opts;
}

export default main();
