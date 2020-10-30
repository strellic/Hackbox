import Docker from "dockerode";
import streams from 'memory-streams';

import User from "./models/User.js";

let docker = Docker();

let containerIP = (container) => {
	return new Promise((resolve, reject) => {
		container.inspect((err, inspect) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(inspect.NetworkSettings.IPAddress)	
			}
		});
	});
};

let startContainer = (options, reset = false) => {
	return new Promise((resolve, reject) => {
		let finish = (err, data) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		}

		docker.createContainer(options).then((container) => {
			container.start((err, data) => finish(err, container));
		})
		.catch((err) => {
			if (err.json.message && err.json.message.includes("Conflict")) {
				let containerId = err.json.message.match(/"(.{64})"/)[1].slice(0, 12);
				let container = docker.getContainer(containerId);

				if(reset) {
					container.remove({force: true}, () => {
						startContainer(options).then(resolve).catch(reject);
					});
				}
				else {
					container.restart((err, data) => finish(err, container));
				}
			}
			else {
				reject(err);
			}
		});
	});
};

let listVolumes = () => {
	return new Promise((resolve, reject) => {
		docker.listVolumes((err, volumes) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(volumes);
			}
		})
	});
}

let listContainers = () => {
	return new Promise((resolve, reject) => {
		docker.listContainers((err, volumes) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(volumes);
			}
		})
	});
}

let runContainer = (image, commands = [], create_opts = {}, stream = new streams.WritableStream(), launch_opts = {}) => {
	return new Promise((resolve, reject) => {
		docker.run(image, commands, stream, create_opts, launch_opts, (err, data, container) => {
			if(err) {
				reject(err, stream);
			}
			else {
				resolve(container);
			}
		});
	});
};

let killUserContainer = async (user, name) => {
	return new Promise((resolve, reject) => {
		try {
			let container = docker.getContainer(name);

			let userContainers = user.containers.slice();
			for (let i = containers.length - 1; i >= 0; i--) {
        		if (containers[i].id == container.id) {
        			docker.getContainer(container.id).remove({force: true});
        			containers.splice(i, 1);
        		}
			}

			if(containers != user.containers) {
				user.containers = containers;
				user.save();
			}

			container.remove({force: true});
		}
		catch(err) {

		}
		resolve();
	});
}

let cleanup = () => {
	return new Promise((resolve, reject) => {
		let kill = [];
		
		User.find({}, (err, users) => {
	        if(err) {
	        	reject(err);
	        	return;
	        }

	        users.forEach(user => {
	        	let containers = user.containers.slice();

	        	for (let i = containers.length - 1; i >= 0; i--) {
	        		if (new Date() >= containers[i].expiresAt) {
	        			kill.push(containers[i]);
	        			containers.splice(i, 1);
	        		}
				}

				if(containers != user.containers) {
					user.containers = containers;
					user.save();
				}
	        });

	        resolve();

	       	for(let i = 0; i < kill.length; i++) {
				try {
			        docker.getContainer(kill[i].id).remove({force: true});
			    }
			    catch(err) {
			        console.log("[VPN] Error: A container scheduled for cleanup was not found.", kill[i]);
			    }
			}
	    });
	});
};

export default { containerIP, startContainer, listVolumes, listContainers, runContainer, killUserContainer, cleanup }