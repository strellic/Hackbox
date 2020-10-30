import express from "express";
const router = express.Router();

import User from "../models/User.js";
import Room from "../models/Room.js";

import userRouter from "./api/user.js";
import vpnRouter from "./api/vpn.js";
import roomRouter from "./api/room.js";

router.use("/user", userRouter);
router.use("/vpn", vpnRouter);
router.use("/room", roomRouter);

router.get("/info", async (req, res) => {
	let users = await User.find({});
	let rooms = await Room.find({});

	res.json({
		"success": true,
		"response": {
			"users": users.length,
			"rooms": rooms.length
		}
	});
});

router.get("/version", async (req, res) => {
	res.json({
		"success": true,
		"version": 1.0
	});
});

export default router;