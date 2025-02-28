#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';

import readPkg from 'read-pkg';
import requireFromString from 'require-from-string';
import tar from 'tar-fs';
import {x} from 'tinyexec';
import tmp from 'tmp';
import yargs from 'yargs';
import zlib from 'node:zlib';

tmp.setGracefulCleanup();

const PRELUDE = `
var Module = require('node:module');
var originalLoader = Module._load

Module._load = function(path, parent) {
	if (path.startsWith('.') || Module.builtinModules.includes(path)) {
	  return originalLoader.apply(this, arguments);
	}
	var dummy = new Proxy({}, {
		get() {
			return dummy;
		}
	});
	return dummy;
};
`;

function main(flags) {
	if (!Proxy) {
		console
			.warn('Skipping pkg-check, detected missing Proxy support')
			.process.exit(0);
	}

	const cwd = flags.cwd || process.cwd();
	const skipImport =
		typeof flags.skipImport === 'boolean' ? flags.skipImport : false;

	return readPkg({cwd}).then((pkg) => {
		return getTarballFiles(cwd, {write: !skipImport}).then((tarball) => {
			return getPackageFiles(cwd).then((pkgFiles) => {
				let problems = [];

				if (!flags.skipBin) {
					problems = problems.concat(
						pkgFiles.bin
							.filter((binFile) => tarball.files.indexOf(binFile) === -1)
							.map((binFile) => ({
								type: 'bin',
								file: binFile,
								message: `Required bin file ${binFile} not found for ${pkg.name}`,
							}))
					);
				}

				if (!flags.skipMain && tarball.files.indexOf(pkgFiles.main) === -1) {
					problems.push({
						type: 'main',
						file: pkgFiles.main,
						message: `Required main file ${pkgFiles.main} not found for ${pkg.name}`,
					});
				}

				if (!flags.skipImport && !flags.skipMain) {
					const importable = fileImportable(
						path.join(tarball.dirname, pkgFiles.main)
					);
					if (!importable[1]) {
						problems.push({
							type: 'import',
							file: pkgFiles.main,
							message: `Error while importing ${pkgFiles.main}: ${importable[0].message}`,
						});
					}
				}

				return {
					pkg: pkg,
					pkgFiles: pkgFiles,
					files: tarball.files,
					problems: problems,
				};
			});
		});
	});
}

main(
	yargs
		.options({
			cwd: {
				description: 'directory to execute in',
				type: 'string',
			},
			skipMain: {
				default: false,
				type: 'boolean',
				description: 'Skip main checks',
			},
			skipBin: {
				default: false,
				type: 'boolean',
				description: 'Skip bin checks',
			},
			skipImport: {
				default: false,
				type: 'boolean',
				description: 'Skip import smoke test',
			},
		})
		.scriptName('pkg-check')
		.usage('pkg-check\n')
		.usage('Check if a package creates valid tarballs')
		.example('$0', '')
		.help()
		.version()
		.strict().argv
)
	.then((report) => {
		if (report.problems.length > 0) {
			console.log(
				`Found ${report.problems.length} problems while checking tarball for ${report.pkg.name}:`
			);

			report.problems.forEach((problem) => {
				console.log(problem.message);
			});

			process.exit(1);
		}
	})
	.catch((err) => {
		setTimeout(() => {
			throw err;
		}, 0);
	});

async function getTarballFiles(source, options) {
	const tmpDir = tmp.dirSync({
		keep: false,
		unsafeCleanup: true,
	});
	const cwd = tmpDir.name;
	const tarball = path.join(cwd, 'test-archive.tgz');
	await x('yarn', ['pack', '--filename', tarball], {
		nodeOptions: {cwd: source},
	});

	return getArchiveFiles(tarball, options);
}

function getArchiveFiles(filePath, options) {
	const write = typeof options.write === 'boolean' ? options.write : true;

	return new Promise((resolve, reject) => {
		const files = [];
		fs.createReadStream(filePath)
			.pipe(zlib.createGunzip())
			.pipe(
				tar.extract(path.dirname(filePath), {
					ignore(_, header) {
						files.push(path.relative('package', header.name));
						return !write;
					},
				})
			)
			.once('error', (err) => reject(err))
			.once('finish', () =>
				resolve({
					dirname: path.join(path.dirname(filePath), 'package'),
					files: files,
				})
			);
	});
}

function getPackageFiles(source) {
	return readPkg(source).then((pkg) => {
		return {
			main: normalizeMainPath(pkg.main || './index.js'),
			bin: getPkgBinFiles(pkg.bin),
		};
	});
}

function normalizeMainPath(mainPath) {
	const norm = path.normalize(mainPath);
	if (norm[norm.length - 1] === path.sep) {
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
		return Object.values(bin).map((b) => path.normalize(b));
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
