import {merge} from 'lodash';

// Resolve extend configs
export default function resolveExtends(config, prefix = '', key = 'extends') {
	return Object.values(config[key] || [])
		.reduce((merged, extender) => {
			const name = [prefix, extender]
				.filter(String)
				.join('-');
			return merge(
				{},
				merged,
				resolveExtends(require(name))
			);
		}, config);
}
