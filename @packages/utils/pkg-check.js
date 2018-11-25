#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const execa = require('execa');
const meow = require('meow');
const readPkg = require('read-pkg');
const requireFromString = require('require-from-string');
const tar = require('tar-fs');
const {values} = require('lodash');
const {fix} = require('@commitlint/test');

const builtin = require.resolve('is-builtin-module');

const PRELUDE = `
var _require = require;

require = function(id) {
	var dummy = new Proxy({}, {
		get() {
			return dummy;
		}
	});

	var _isBuiltIn = _require('${builtin}');
	if (id[0] === '.' || _isBuiltIn(id)) {
		return _require(id);
	} else {
		return dummy;
	}
};
`;

function main(cli) {
	if (!Proxy) {
		console
			.warn('Skipping pkg-check, detected missing Proxy support')
			.process.exit(0);
	}

	const cwd = cli.flags.cwd || process.cwd();
	const skipImport =
		typeof cli.flags.skipImport === 'boolean' ? cli.flags.skipImport : false;

	return readPkg(cwd).then(pkg => {
		return getTarballFiles(cwd, {write: !skipImport}).then(tarball => {
			return getPackageFiles(cwd).then(pkgFiles => {
				const problems = [];

				if (!cli.flags.skipBin) {
					problems.concat(
						pkgFiles.bin
							.filter(binFile => tarball.files.indexOf(binFile) === -1)
							.map(binFile => ({
								type: 'bin',
								file: binFile,
								message: `Required bin file ${binFile} not found for ${
									pkg.name
								}`
							}))
					);
				}

				if (
					!cli.flags.skipMain &&
					tarball.files.indexOf(pkgFiles.main) === -1
				) {
					problems.push({
						type: 'main',
						file: pkgFiles.main,
						message: `Required main file ${pkgFiles.main} not found for ${
							pkg.name
						}`
					});
				}

				if (!cli.flags.skipImport && !cli.flags.skipMain) {
					const importable = fileImportable(
						path.join(tarball.dirname, pkgFiles.main)
					);
					if (!importable[1]) {
						problems.push({
							type: 'import',
							file: pkgFiles.main,
							message: `Error while importing ${pkgFiles.main}: ${
								importable[0].message
							}`
						});
					}
				}

				return {
					pkg: pkg, // eslint-disable-line object-shorthand
					pkgFiles: pkgFiles, // eslint-disable-line object-shorthand
					files: tarball.files,
					problems: problems // eslint-disable-line object-shorthand
				};
			});
		});
	});
}

main(
	meow(`
	pkg-check

	Check if a package creates valid tarballs

	Options
		--skip-main    Skip main checks
		--skip-bin     Skip bin checks
		--skip-import  Skip import smoke test

	Examples
	  $ pkg-check
`)
)
	.then(report => {
		if (report.problems.length > 0) {
			console.log(
				`Found ${report.problems.length} problems while checking tarball for ${
					report.pkg.name
				}:`
			);

			report.problems.forEach(problem => {
				console.log(problem.message);
			});

			process.exit(1);
		}
	})
	.catch(err => {
		setTimeout(() => {
			throw err;
		});
	});

function getTarballFiles(source, options) {
	return fix
		.bootstrap(source)
		.then(cwd =>
			execa('npm', ['pack'], {cwd}).then(cp => path.join(cwd, cp.stdout))
		)
		.then(tarball => getArchiveFiles(tarball, options));
}

function getArchiveFiles(filePath, options) {
	const write = typeof options.write === 'boolean' ? options.write : true;

	return new Promise((resolve, reject) => {
		const files = [];
		fs
			.createReadStream(filePath)
			.pipe(zlib.createGunzip())
			.pipe(
				tar.extract(path.dirname(filePath), {
					ignore(_, header) {
						files.push(path.relative('package', header.name));
						return !write;
					}
				})
			)
			.once('error', err => reject(err))
			.once('finish', () =>
				resolve({
					dirname: path.join(path.dirname(filePath), 'package'),
					files: files // eslint-disable-line object-shorthand
				})
			);
	});
}

function getPackageFiles(source) {
	return readPkg(source).then(pkg => {
		return {
			main: normalizeMainPath(pkg.main || './index.js'),
			bin: getPkgBinFiles(pkg.bin)
		};
	});
}

function normalizeMainPath(mainPath) {
	const norm = path.normalize(mainPath);
	if (norm[norm.length - 1] === '/') {
		return `${norm}index.js`;
	}
	return norm;
}

function getPkgBinFiles(bin) {
	if (!bin) {
		return [];
	}

	if (typeof bin === 'string') {
		return [path.normalize(bin)];
	}

	if (typeof bin === 'object') {
		return values(bin).map(b => path.normalize(b));
	}
}

function fileImportable(file) {
	try {
		requireFromString(
			`
			${PRELUDE}
			${fs.readFileSync(file)}
		`,
			file
		);
		return [null, true];
	} catch (err) {
		return [err, false];
	}
}
