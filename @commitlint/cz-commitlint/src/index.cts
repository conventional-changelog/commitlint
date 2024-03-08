const esmPrompterPromise = import('./index.js');

export const prompter: Awaited<typeof esmPrompterPromise>['prompter'] = async (
	...args
) => {
	(await esmPrompterPromise).prompter(...args);
};
