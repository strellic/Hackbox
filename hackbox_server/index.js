import mongoose	from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import passport from "passport";
import { spawn } from 'child_process';

dotenv.config();

import "./authenticate.js";
import dbSetup from "./db_setup.js";
import utils from "./utils.js";
import { initVPN } from "./vpn_setup.js";

import apiRouter from "./routes/api.js";

initVPN().then(() => {
	let app = express();

	mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_IP}/${process.env.MONGO_DBNAME}`,
		{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
	);

	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(cors({
		origin: process.env.ORIGIN
	}));
	app.options("*", cors({
		origin: process.env.ORIGIN
	}));

	app.use(passport.initialize());

	app.use((req, res, next) => {
		const token = req.headers.authorization;

		if (token) {
			try {
				let decoded = jwt.verify(token, process.env.JWT_SECRET);
				req.jwt = decoded;
			}
			catch (err) {
				req.jwt = null;
			}
		}
		else {
			req.jwt = null;
		}

		next();
	});

	app.use("/api", apiRouter);

	app.get("/", (req, res) => {
		res.send("Hackbox API Server");
	});

	app.listen(process.env.PORT, () => {
		console.log(`[API] Hackbox server listening at http://localhost:${process.env.PORT}`)
	});

	dbSetup();

	console.log(process.env.ENABLE_GOTTY);

	let gotty = null;
	if(process.env.ENABLE_GOTTY === "true") {
		gotty = spawn('./gotty/gotty', ['--title-format', 'Webshell', '-w', '-p', process.env.GOTTY_PORT, '--permit-arguments', './gotty/serve.sh']);
		gotty.on('close', (code) => {
			console.log(`[GOTTY] Child process exited with code ${code}.`);
		});
		console.log(`[GOTTY] GOTTY server listening at http://localhost:${process.env.GOTTY_PORT}`);
	}

	setInterval(utils.cleanup, 60 * 1000);
	utils.cleanup();
})
.catch((err) => {
	console.log("[!!!] There was an error initializing the VPN.");
	console.log(err);
});
