import express from "express";
import Docker from 'dockerode';
import dotenv from "dotenv";
import streams from 'memory-streams';

dotenv.config();

import User from "../../models/User.js";
import { requiresLogin } from "../../authenticate.js";

const router = express.Router();
const docker = new Docker();

router.post("/ovpn", requiresLogin, async (req, res) => {
	/*
		This runs:
		docker run -v ${process.env.OPENVPN_VOLUME}:/etc/openvpn --log-driver=none --rm -it kylemanna/openvpn easyrsa build-client-full ${username} nopass
		docker run -v ${process.env.OPENVPN_VOLUME}:/etc/openvpn --log-driver=none --rm kylemanna/openvpn ovpn_getclient ${username}
	*/

	User.findOne({ username: req.jwt.username }, (err, user) => {
      	if (err || !user) {
      		return res.json({
				"success": false,
				"error": "No user found!"
			});
      	}

      	if(user.ovpn) {
      		return res.json({
				success: true,
				ovpn: user.ovpn
			});
      	}

		let ovpn_config = {
			Tty: true,
			AttachStdout: true,
			HostConfig: {
				LogConfig: {
					Type: "none"
				},
				AutoRemove: true,
				Binds: ["ovpn-data-hackbox:/etc/openvpn"]
			},
			Env: [
				`EASYRSA_PASSIN=pass:${process.env.OPENVPN_CA_PASS}`
			]
		};

		let generate_args = ['easyrsa', 'build-client-full', req.jwt.username, 'nopass'];	
		let generate_stdout = new streams.WritableStream();

		let get_args = ['ovpn_getclient', req.jwt.username];
		let get_stdout = new streams.WritableStream();

		docker.run('kylemanna/openvpn', generate_args, generate_stdout, ovpn_config, (err, data, container) => {
			if(err) {
				console.log(`[VPN] There was an error generating ${req.jwt.username}'s .ovpn file. Output below:`);
				console.log(err, generate_stdout.toString());

				return res.json({
					success: false,
					error: "There was an error generating your .ovpn file."
				});
			}

			docker.run('kylemanna/openvpn', get_args, get_stdout, ovpn_config, (err, data, container) => {
				if(err) {
					console.log(`[VPN] There was an error retrieving ${req.jwt.username}'s .ovpn file. Output below:`);
					console.log(err, get_stdout.toString());

					return res.json({
						success: false,
						error: "There was an error retrieving your .ovpn file."
					});
				}

				let ovpn = get_stdout.toString();
				ovpn = ovpn.replace("redirect-gateway def1", "route 172.0.0.0 255.0.0.0"); // only use VPN for internal routing!

				if(!ovpn.includes("OpenVPN Static key")) {
					return res.json({
						success: false,
						error: "There was an error saving your .ovpn file."
					})
				}

				user.ovpn = ovpn;
				user.save();

				return res.json({
					success: true,
					ovpn: ovpn
				});
			});
		});
	});
});

export default router;