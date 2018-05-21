const Stream = require('./StreamServer');
const fetch = require('node-fetch');
const fs = require('fs');
const cp = require('child_process');

class DigiStream {
	constructor(id, stream_id, uuid, ip, endpoint) {
		this.settings = {
			id: id,
			uuid: uuid,
			stream_id: stream_id,
			ip: ip,
			endpoint: endpoint
		};
		this.errors = 0;
		this.stream = new Stream;

		fetch(`http://${this.settings.endpoint}/api/repo/${this.settings.id}/stream`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				uuid: uuid,
				stream_id: stream_id,
				ip: ip,
				status: 1
			})
		});

		this.parseCommands();
	}

	async parseCommands() {
		let build_settings = await readSettingsAsync('/home/build/.DigiCI');

		await this.forEachAsync(build_settings);

		fetch(`http://${this.settings.endpoint}/api/repo/${this.settings.id}/stream`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				uuid: this.settings.uuid,
				stream_id: this.settings.stream_id,
				history: this.stream.history,
				status: this.errors ? 3 : 2
			})
		}).then(() => { process.exit() })
	}

	forEachAsync(build_settings) {
		return new Promise((resolve) => {
			let count = 0;
			build_settings['do'].forEach(async (command) => {
				count++;
				await this.runCommandAsync(command);
				if(count === build_settings['do'].length) { resolve() }
			})
		});
	}

	runCommandAsync(command) {
		return new Promise((resolve) => {
			cp.exec(command, {cwd: '/home/build'},(error, stdout, stderr) => {
				if(error) {
					this.errors++;
					this.stream.send({error: error})
				} else if(stdout) {
					this.stream.send({stdout: stdout})
				}else if(stderr) {
					this.errors++;
					this.stream.send({stderr: stderr})
				}
				resolve()
			})
		});
	}
}


function readSettingsAsync(file) {
	return new Promise(function (resolve, reject) {
		fs.readFile(file, function (error, result) {
			if (error) {
				reject(error);
			} else {
				try {
					resolve(JSON.parse(result))
				} catch(error) {
					reject(error);
				}
			}
		});
	});
}

module.exports = DigiStream;