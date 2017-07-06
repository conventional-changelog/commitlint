export default (name, require = module.require) => {
	return require(`conventional-changelog-${name}`);
};
