/*
 * This script is used to copy over the version number in the package.json to
 * the OPCONNECT_VERSION constant in the index.ts file. This is done to
 * ensure that the version number attribute on the OPConnect wrapper is always
 * up to date with the version number in the package.json file.
 */

const fs = require('fs');
const config = require('./packages/opconnect/package.json');

const file = fs.readFileSync('packages/opconnect/src/index.ts', 'utf8');
const lines = file.split('\n');
const versionLine = lines.findIndex((line) =>
  line.includes('export const OPCONNECT_VERSION = ')
);
lines[versionLine] = `export const OPCONNECT_VERSION = '${config.version}';`;

fs.writeFileSync('packages/opconnect/src/index.ts', lines.join('\n'), 'utf8');
