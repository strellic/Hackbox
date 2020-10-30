import passport from 'passport';
import local from'passport-local';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./models/User.js";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new local.Strategy(
	{
		session: false
	},
  async (username, password, done) =>  {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
      	return done(err);
      }
      if (!user) {
      	return done(null, false);
      }

      bcrypt.compare(password, user.password, (err, result) => {
		    if (err) {
		      return done(err);
		    }
		    if (!result) {
		    	return done(null, false);
		    }
		    return done(null, user);
		  });
    });
  }
));

function sign(user) {
  return jwt.sign({username: user.username, email: user.email, isSignedIn: true}, process.env.JWT_SECRET, { expiresIn: 86400 });
}

function requiresLogin(req, res, next) {
  if(req.jwt && req.jwt.isSignedIn) {
    next();
  }
  else {
    return res.json({
      "success": false,
      "error": "You are not signed in!",
    });
  }
}

export { sign, requiresLogin };