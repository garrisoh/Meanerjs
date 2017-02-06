'use strict';

/**
 *
 */

var db = require('./db');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

module.exports = function(req, res) {
	// Check db for user with given email, if doesn't exist send error
	db.readOne('users', {email: req.body.email})
		.then(function(user) {
			if(!user) throw 'Login error';
			
			// Once user info is retrieved, check against hashed password.  If fail, send error.
			var hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64).toString('hex');
			if(hash !== user.hash) throw 'Login error';

			// If success, create and send token
			var s = process.env.MEANTUT_TK;
			var now = new Date();
			var expDate = new Date();
			expDate.setDate(expDate.getDate() + 7);

			// TODO: Set expire duration globally somewhere
			var token = jwt.sign({
				uid: user._id,
				iat: parseInt(now.getTime() / 1000),
				exp: parseInt(expDate.getTime() / 1000)
			}, s);

			res.status(200);
			res.json({'token': token});
		}).catch(function(err) {
			if(err == 'Login error') {
				res.status(403);
				res.json({'message': 'Invalid email or password.'});
			} else {
				res.status(500);
				res.json({'message': 'Server error (' + err + ')'});
			}
		});
};
