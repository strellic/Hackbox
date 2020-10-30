import express from "express";
import Docker from "dockerode";
import streams from 'memory-streams';

import User from "../../models/User.js";
import Room from "../../models/Room.js";
import { requiresLogin } from "../../authenticate.js";
import { getMasterVPN } from "../../vpn_setup.js";
import utils from "../../utils.js";

const router = express.Router();
let docker = Docker();

router.post("/extend", requiresLogin, async (req, res) => {
	if (!req.body.name) {
		return res.json({
			success: false,
			error: "Missing room name!"
		});
	}

	let user = await User.findOne({username: req.jwt.username});
	if(!user) {
		return res.json({
			success: false,
			error: "Invalid username!"
		});
	}

	let min = parseInt(process.env.BOX_DURATION);

	for(let i = 0; i < user.containers.length; i++) {
		if(user.containers[i].room === req.body.name || user.containers[i].image === `strellic/openvpn-client`) {
			user.containers[i].expiresAt = new Date(+new Date() + min * 60 * 1000);
		}
	}

	user.save();

	res.json({
		success: true
	});
});

router.post("/destroy", requiresLogin, async (req, res) => {
	if (!req.body.name) {
		return res.json({
			success: false,
			error: "Missing room name!"
		});
	}

	let user = await User.findOne({username: req.jwt.username});
	if(!user) {
		return res.json({
			success: false,
			error: "Invalid username!"
		});
	}

	let count = 0;
	for(let i = 0; i < user.containers.length; i++) {
		if(user.containers[i].room === req.body.name) {
			user.containers[i].expiresAt = new Date(0);
			count++;
		}
	}

	if(user.containers.length === count + 1) {
		for(let i = 0; i < user.containers.length; i++) {
			user.containers[i].expiresAt = new Date(0);
		}
	}

	await user.save();
	await utils.cleanup();

	res.json({
		success: true
	});
});

router.post("/list", requiresLogin, async (req, res) => {
	let rooms = await Room.find({});

	let user = await User.findOne({ username: req.jwt.username });
	if(!user) {
		return res.json({
			success: false,
			error: "Invalid username!"
		});
	}

	let data = [];
	for(let i = 0; i < rooms.length; i++) {
		data.push({
			name: rooms[i].name,
			displayName: rooms[i].displayName,
			difficulty: rooms[i].difficulty,
			shortDescription: rooms[i].shortDescription,
			icon: rooms[i].icon,
			completed: user.completed.includes(rooms[i].name)
		});
	}
	return res.json({
		success: true,
		response: data
	});
});

router.post("/info", requiresLogin, async (req, res) => {
	if (!req.body.name) {
		return res.json({
			success: false,
			error: "Missing room name!"
		});
	}

	let room = await Room.findOne({name: req.body.name});
	if (!room) {
		return res.json({
			success: false,
			error: "Invalid room name!"
		});
	}

	let user = await User.findOne({username: req.jwt.username});
	if(!user) {
		return res.json({
			success: false,
			error: "Invalid username!"
		});
	}

	return res.json({
		success: true,
		response: {
			name: room.name,
			displayName: room.displayName,
			difficulty: room.difficulty,
			shortDescription: room.shortDescription,
			markdown: room.markdown,
			flags: room.flags.map(x => x.name),
			completed: user.completed.includes(room.name)
		}
	})
});

router.post("/check", requiresLogin, async (req, res) => {
	if (!req.body.name) {
		return res.json({
			success: false,
			error: "Missing room name!"
		});
	}

	if (!req.body.flags) {
		return res.json({
			success: false,
			error: "You have not submitted any flags!"
		});
	}

	let room = await Room.findOne({name: req.body.name});
	if (!room) {
		return res.json({
			success: false,
			error: "Invalid room name!"
		});
	}

	let flags = [];
	let failed = false;

	for(let i = 0; i < room.flags.length; i++) {
		let { name, flag } = room.flags[i];
		if(req.body.flags[name] && req.body.flags[name] === flag) {
			flags.push({name: name, correct: true});
		}
		else {
			failed = true;
			flags.push({name: name, correct: false});
		}
	}

	if(!failed) {
		let user = await User.findOne({username: req.jwt.username});
		if(!user.completed.includes(req.body.name)) {
			user.completed.push(req.body.name);
			user.save();
		}
	}

	return res.json({
		success: true,
		response: {
			flags: flags,
			failed: failed,
			msg: room.successMsg
		}
	});
});

router.post("/launch", requiresLogin, async (req, res) => {
	let name = req.body.name;
	let username = req.jwt.username;

	if (!name) {
		return res.json({
			success: false,
			error: "Missing room name!"
		});
	}

	let user = await User.findOne({username});
	if(!user) {
		return res.json({
			success: false,
			error: "Invalid username!"
		});
	}
	if(!user.ovpn) {
		return res.json({
			success: false,
			error: "Please generate an .ovpn file first!"
		});
	}

	let room = await Room.findOne({name});
	if (!room) {
		return res.json({
			success: false,
			error: "Invalid room name!"
		});
	}

	let images = room.images;
	let usage = user.containers.reduce((curr, next) => curr += next.takesToken ? 1 : 0, 0);
	let price = images.length;

	if(usage + price > user.tokens) {
		return res.json({
			success: false,
			error: "Please destroy some other boxes before launching this room!"
		});
	}

	let min = parseInt(process.env.BOX_DURATION) || 60;

	let vpn_create = {
		Image: 'strellic/openvpn-client',
		name: `hackbox_vpn_${username}`,
		Tty: true,
		AttachStdout: true,
		HostConfig: {
			CapAdd: ["NET_ADMIN"],
			Devices: [{
				"PathOnHost": "/dev/net/tun",
				"PathInContainer": "/dev/net/tun",
				"CgroupPermissions": "rwm"
			}]
		},
		Cmd: ["/bin/sh", "-c", `echo "${Buffer.from(user.ovpn, 'utf-8').toString('base64')}" | base64 -d > /vpn/config/config.ovpn; openvpn --config /vpn/config/config.ovpn`]
	};
	// docker run -d --cap-add NET_ADMIN --device /dev/net/tun --name vpn strellic/openvpn-client

	let masterVPN = getMasterVPN();
	let masterIP = await utils.containerIP(masterVPN);

	let containers = [];

	await utils.killUserContainer(user, `hackbox_vpn_${username}`);

	let clientVPN;
	try {
		clientVPN = await utils.startContainer(vpn_create);
	}
	catch(err) {
		console.log(`[ROOM] There was an error launching ${username}'s VPN client!`, err);
		return res.json({
			success: false,
			error: "There was an error launching your VPN client."
		});
	}

	let clientIP = await utils.containerIP(clientVPN);

	containers.push({
		id: clientVPN.id,
		image: 'strellic/openvpn-client',
		room: name,
		expiresAt: new Date(+new Date() + min * 60 * 1000),
		takesToken: false,
		ip: clientIP
	});

	clientVPN.exec({Cmd: ["/bin/sh", "-c", "ip route add 192.168.0.0/16 via " + masterIP]}, (err, exec) => {
		exec.start();
	}); 

	for (let i = 0; i < images.length; i++) {
		// docker run --network "container:vpn" ${image}
		let room_create = {
			Image: images[i],
			name: `hackbox_room_${username}_${name}_${i}`,
			Tty: false,
			HostConfig: {
				NetworkMode: `container:hackbox_vpn_${username}`,
				Memory: 512000000,
				CpuPeriod: 100000,
				CpuQuota: 100000
			}
		};

		await utils.killUserContainer(user, `hackbox_room_${username}_${name}_${i}`);

		let container = await utils.startContainer(room_create, true);
		containers.push({
			id: container.id,
			image: images[i],
			room: name,
			expiresAt: new Date(+new Date() + min * 60 * 1000),
			takesToken: true,
			ip: clientIP
		});

		if(images.length === (containers.length - 1)) { // -1 b/c VPN container
			user.containers = user.containers.concat(containers);
			user.save();

			return res.json({
				success: true,
				response: clientIP
			});
		}
	}
});

export default router;