import Docker from "dockerode";
import dotenv from "dotenv";
import fs from "fs";
import streams from 'memory-streams';
import utils from "./utils.js";

dotenv.config();

// This setup file runs the equivalent of:
// docker run -v ${process.env.OPENVPN_VOLUME}:/etc/openvpn --log-driver=none --rm -it kylemanna/openvpn rm /etc/openvpn/ovpn_env.sh /etc/openvpn/openvpn.conf
// docker run -v ${process.env.OPENVPN_VOLUME}:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://${process.env.OPENVPN_SERVER} -N -p "route 172.0.0.0 255.0.0.0" -n 8.8.8.8
// docker run --name hackbox_openvpn -v ${process.env.OPENVPN_VOLUME}:/etc/openvpn -d -p 1194:1194/udp --cap-add=NET_ADMIN kylemanna/openvpn

let docker = Docker();

let ovpn_setup = {
	Tty: false,
	AttachStdout: false,
	HostConfig: {
		LogConfig: {
			Type: "none"
		},
		AutoRemove: true,
		Binds: [`${process.env.OPENVPN_VOLUME}:/etc/openvpn`]
	},
	Env: [
		"OVPN_ENV=/etc/openvpn/environ" // 65536 allowed
	]
};

let ovpn_launch = {
	Image: 'kylemanna/openvpn',
	name: "hackbox_openvpn",
	Tty: false,
	AttachStdout: false,
	ExposedPorts: {
		"1194/udp": {}
	},
	HostConfig: {
		Binds: [`${process.env.OPENVPN_VOLUME}:/etc/openvpn`],
		CapAdd: ["NET_ADMIN"],
		PortBindings: {	
	        "1194/udp": [	
				{	
					"HostIp": "0.0.0.0",	
					"HostPort": "1194"	
				}	
			]	
	    },
	},
	Cmd: []
};

let gen_cmd = [
	"/bin/bash",
	"-c",
	`rm /etc/openvpn/ovpn_env.sh /etc/openvpn/openvpn.conf; echo "OVPN_SERVER=192.168.0.0/16" >> /etc/openvpn/ovpn_env.sh; ovpn_genconfig -u "udp://${process.env.OPENVPN_SERVER}" -N -b -p "route 172.0.0.0 255.0.0.0" -p "route 192.168.0.0 255.255.0.0" -n "8.8.8.8"`
];

let vpnContainer = null;

let initVPN = () => {
	console.log("[VPN] Initializing VPN container...");
	return new Promise(async (resolve, reject) => {
		try {
			let volumes = await utils.listVolumes();
			if(!volumes.Volumes.find(v => v.Name === process.env.OPENVPN_VOLUME)) {
				throw new Error(`No VPN volume found by the name of ${process.env.OPENVPN_VOLUME}. Check out the setup instructions at https://github.com/kylemanna/docker-openvpn`);
			}
		}
		catch(err) {
			return reject("[VPN] Error listing volumes:", err.message);
		}

		try {
			let containers = await utils.listContainers();
			containers.forEach((containerInfo) => {
				if(containerInfo.Names.includes("/hackbox_openvpn")) {
					docker.getContainer(containerInfo.Id).remove({force: true});
					console.log("[VPN] Deleted active OpenVPN docker.");
				}
			});
		}
		catch(err) {
			return reject("[VPN] Error listing volumes:", err.message)
		}

		utils.runContainer('kylemanna/openvpn', gen_cmd, ovpn_setup).then(async () => {
			console.log("[VPN] VPN config generation successful.")

			try {
				vpnContainer = await utils.startContainer(ovpn_launch);
			}
			catch(err) {
				reject("[VPN] Error starting the OpenVPN container!", err);
			}

			console.log("[VPN] VPN successfully launched.")
			resolve(vpnContainer)
		})
		.catch((err, stream) => reject("[VPN] Error resetting the OpenVPN container!", err, stream));
	});
}

let getMasterVPN = () => {
	return vpnContainer;
}

export { initVPN, getMasterVPN };