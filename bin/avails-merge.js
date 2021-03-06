#!/usr/bin/env node

const readMultipleAvailsFromPaths = require('../lib/readMultipleAvailsFromPaths');
const mergeAvails = require('../lib/mergeAvails');
const writeAvailsToStream = require('../lib/writeAvailsToStream');

const program = require('commander');

program
  .description('merge historical Avails in order into a single Avails')
  .usage('[options] <infile')
  .option('-i, --input [type]', 'Add the specified type of input [tsv|json|xlsx] (required)')
  .option('-o, --output [type]', 'Add the specified type of output [tsv|json|xlsx] (required)')
  .parse(process.argv);

if (!program.input || !program.output) {
  program.outputHelp();
  process.exit(1);
}

readMultipleAvailsFromPaths(program.args, program.input)
  .then(function (availss) {
    return mergeAvails(availss);
  })
  .then(function (avails) {
    return writeAvailsToStream(process.stdout, program.output, avails);
  })
  .then(null, function (err) {
    console.error(err.message);
    process.exit(1);
  })
