export default async name => {
	return await require(`conventional-changelog-${name}`);
};
