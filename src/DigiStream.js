Stream = require('./StreamServer');

class DigiStream {

	constructor(id, uuid, endpoint) {
		this.settings = {
			id: id,
			uuid: uuid,
			endpoint: endpoint
		};
		this.stream = new Stream;

		this.initialize();
	}

	initialize() {

	}

}

module.exports = DigiStream;