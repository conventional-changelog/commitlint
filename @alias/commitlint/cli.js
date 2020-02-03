#!/usr/bin/env node
const path = require('path');
const resolvePkg = require('resolve-pkg');
const readPkg = require('read-pkg');

const pkgDir = resolvePkg('@commitlint/cli', {cwd: __dirname});
const manifest = readPkg.sync({cwd: pkgDir});
const bin = path.join(pkgDir, manifest.bin.commitlint);

require(bin);
