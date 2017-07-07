import importFrom from 'import-from';

const cwd = importFrom.bind(null, process.cwd());

export default (name, require = cwd) => {
	return require(`conventional-changelog-${name}`);
};
