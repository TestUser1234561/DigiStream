let program = require('commander');
let DigiStream = require('../src/DigiStream');
let id, uuid, endpoint;

program.option('-e, --endpoint [url]', 'Set data endpoint').parse(process.argv);

id = program.args[0];
uuid = program.args[1];
endpoint = program.endpoint ? program.endpoint : 'localhost:3000';

new DigiStream(id, uuid, endpoint);