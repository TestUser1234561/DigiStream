let program = require('commander');
let DigiStream = require('../src/DigiStream');

program.option('-e, --endpoint [url]', 'Set data endpoint').parse(process.argv);

let id = program.args[0];
let stream_id = program.args[1];
let uuid = program.args[2];
let endpoint = program.endpoint ? program.endpoint : 'localhost:3000';

new DigiStream(id, stream_id, uuid, endpoint);