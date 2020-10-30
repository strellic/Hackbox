import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import passport from "passport";

import User from "../../models/User.js";
import { sign, requiresLogin } from "../../authenticate.js";

const router = express.Router();

router.get("/count", async (req, res) => {
	let users = await User.find({});
	res.json({
		"success": "true",
		"response": {
			"count": users.length
		}
	});
});

router.get("/list", async (req, res) => {
	let users = await User.find({});

	let data = [];
	for(let i = 0; i < users.length; i++) {
		data.push({
			username: users[i].username,
			completed: users[i].completed,
		});
	}

	return res.json({
		success: true,
		response: data
	});
});

router.post("/box_info", requiresLogin, async (req, res) => {
	let user = await User.findOne({username: req.jwt.username});

	if(!user) {
		return res.json({
			success: false,
			error: "Invalid username!"
		});
	}

	let containers = [];

	for(let i = 0; i < user.containers.length; i++) {
		if(new Date() > new Date(user.containers[i].expiresAt))
			continue;
		
		containers.push({
	        room: user.containers[i].room,
	        expiresAt: user.containers[i].expiresAt,
	        ip: user.containers[i].ip
	    });
	}

	return res.json({
		success: true,
		boxes: containers
	})
});

router.post("/update_info", requiresLogin, async (req, res) => {
	let email = req.body.email;
	let name = req.body.name;
	let username = req.body.username;

	User.findOne({ username: req.jwt.username }, (err, user) => {
      	if (err || !user) {
      		return res.json({
				"success": false,
				"error": "No user found!"
			});
      	}

      	if (user.username != username) {
      		if(username.length < 6) {
				return res.json({
					"success": false,
					"error": "Username must be 6 characters at minimum."
				});
			}
			else {
				user.username = username;
			}
		}
		if (user.name != name) {
			user.name = name;
		}
		if (user.email != email) {
			if(!validator.isEmail(email)) {
				return res.json({
					"success": false,
					"error": "That is not a valid email address!"
				});
			}
			else {
				user.email = email;
			}
		}

		user.save();

      	return res.json({
			"success": true,
			"token": sign(user)
		});
    });
});

router.post("/update_pass", requiresLogin, async (req, res) => {
	let currentPassword = req.body.currentPassword;
	let newPassword = req.body.newPassword;

	if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 8) {
		return res.json({
			"success": false,
			"error": "Password must be 8 characters at minimum."
		});
	}

	User.findOne({ username: req.jwt.username }, (err, user) => {
      	if (err || !user) {
      		return res.json({
				"success": false,
				"error": "No user found!"
			});
      	}

      	bcrypt.compare(currentPassword, user.password, (err, result) => {
		    if (err || !result) {
			    return res.json({
					"success": false,
					"error": "Incorrect password!"
				});
		    }
		    
		    bcrypt.hash(newPassword, 12, (err, hash) => {
				if(err) {
					return res.json({
						"success": false,
						"error": "There was an error changing your password. Please try again."
					});
				}

				user.password = hash;
				user.save();

				return res.json({
					"success": true,
					"message": "Password changed successfully!"
				});
			});
		});
    });
});

router.post("/update_bio", requiresLogin, async (req, res) => {
	let bio = req.body.bio;
	let newPassword = req.body.newPassword;

	User.findOne({ username: req.jwt.username }, (err, user) => {
      	if (err || !user) {
      		return res.json({
				"success": false,
				"error": "No user found!"
			});
      	}

      	user.bio = bio;
      	user.save();
      	return res.json({
			"success": true,
			"message": "Bio changed successfully!"
		});
    });
});

router.post("/info", async (req, res) => {
	let username = req.body.username;
	if (typeof username !== 'string' || username.length < 6) {
		return res.json({
			"success": false,
			"error": "Username must be 6 characters at minimum."
		});
	}

	User.findOne({ username: username }, (err, user) => {
      	if (err || !user) {
      		return res.json({
				"success": false,
				"error": "No user found with that username."
			});
      	}
      	return res.json({
			"success": true,
			"response": {
				"username": user.username,
				"name": user.name || "",
				"bio": user.bio || "",
				"completed": user.completed || []
			}
		});
    });
});

router.post("/register", async (req, res, next) => {
	let username = req.body.username,
		password = req.body.password,
		email = req.body.email;

	if (typeof username !== 'string' || username.length < 6) {
		return res.json({
			"success": false,
			"error": "Username must be 6 characters at minimum."
		});
	}
	if (typeof password !== 'string' || password.length < 8) {
		return res.json({
			"success": false,
			"error": "Password must be 8 characters at minimum."
		});
	}
	if (typeof email !== 'string' || !validator.isEmail(email)) {
		return res.json({
			"success": false,
			"error": "That is not a valid email address!"
		});
	}

	if(!/^[a-zA-Z0-9_]+$/.test(username)) {
		return res.json({
			"success": false,
			"error": "Your username can only consist of letters, numbers, and underscores!"
		});
	}

	bcrypt.hash(password, 12, (err, hash) => {
		if(err) {
			return res.json({
				"success": false,
				"error": "There was an error registering your account. Please try again."
			});
		}

		let user = new User({username, password: hash, email});
		user.save((err) => {
			if(err) {
				return res.json({
					"success": false,
					"error": "A user has already signed up with that username or email!"
				});
			}
			passport.authenticate('local', function(err, user, info) {
			    res.json({
					success: true,
					"token": sign(user)
				});
		  	})(req, res, next);
		});
	});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', function(err, user, info) {
	    if (err) { 
	    	return res.json({
				"success": false,
			 	"error": "There was an error logging in."
			});
	    }
	    if (!user) { 
	        return res.json({
				"success": false,
			 	"error": "Incorrect username or password."
			});
	    }
	    res.json({
			success: true,
			"token": sign(user)
		});
  })(req, res, next);
});

router.post("/auth", requiresLogin, async (req, res) => {
	return res.json({
		"success": true,
		"token": req.jwt
	});
});

export default router;