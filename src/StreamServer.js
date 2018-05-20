const WebSocket = require('ws');

class StreamServer {
	constructor() {
		this.history = [];

		this.server = new WebSocket.Server({
			port: 8080
		});

		let server = this.server;

		server.on('connection', (ws) => {
			ws.send(stringify({history: this.history}))
		});
	}

	send(message) {
		this.history.push(message);
		this.server.clients.forEach((ws) => {
			ws.send(stringify(message));
		});
	}
}

function stringify(m) {
	return Buffer.from(JSON.stringify(m))
}

module.exports = StreamServer;