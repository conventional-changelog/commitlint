import execa from 'execa';
import meow from 'meow';
import vorpal from 'vorpal';
import input from './input';

const HELP = `
  Usage
    $ commit
`;

async function main() {
	const message = await input(vorpal);
	const commit = execa('git', ['commit', '-m', message]);

	commit.stdout.pipe(process.stdout);
	commit.stderr.pipe(process.stderr);

	return commit;
}

main(meow(HELP))
	.catch(err => {
		setTimeout(() => {
			throw err;
		});
	});
