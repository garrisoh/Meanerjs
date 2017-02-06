'use strict';

/**
 * 
 */

// TODO: Use passport as middleware to automatically authenticate users against db any time an api call is made?
// TODO: Send verification email to verify email account

var db = require('./db');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

module.exports = function(req, res) {
	// Validate fields
	if(req.body.firstname === '') {
		res.status(400);
		res.json({'message': 'First name must not be empty'});
		return;
	}

	if(req.body.lastname === '') {
		res.status(400);
		res.json({'message': 'Last name must not be empty'});
		return;
	}

	if(!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(req.body.email)) {
		res.status(400);
		res.json({'message': 'Invalid email address'});
		return;
	}

	if(req.body.password.length < 8) {
		res.status(400);
		res.json({'message': 'Password must be at least 8 characters'});
		return;
	}

	if(!/[a-z]/.test(req.body.password)) {
		res.status(400);
		res.json({'message': 'Password must contain at least 1 lowercase letter'});
		return;
	}

	if(!/[A-Z]/.test(req.body.password)) {
		res.status(400);
		res.json({'message': 'Passowrd must contain at least 1 uppercase letter'});
		return;
	}

	if(!/[^a-zA-Z]/.test(req.body.password)) {
		res.status(400);
		res.json({'message': 'Password must contain at least 1 number or special character'});
		return;
	}

	// Ensure unique email
	db.readOne('users', {email: req.body.email}).then(function(result) {
		if(result !== null) {
			res.status(409);
			res.json({'message': 'An account with the specified email address already exists.'});
			throw 'Email conflict';
		}
	}).then(function() {
		// Create new user, hash password
		var salt = crypto.randomBytes(16).toString('hex');
		var validFrom = new Date();
		var user = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			salt: salt,
			hash: crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha1').toString('hex'),
			validFrom: parseInt(validFrom.getTime() / 1000)
		};

		return user;
	}).then(db.createOne.bind(null, 'users'))
	  .then(function(result) {
		// Check to make sure user was inserted
		if(result.insertedCount != 1) {
			res.status(500);
			res.json({'message': 'Unable to create new account'});
			throw 'Create error';
		}

		// Create token
		var s = process.env.MEANTUT_TK;
		var now = new Date();
		var expDate = new Date();
		expDate.setDate(expDate.getDate() + 7);
	
		var token = jwt.sign({
			uid: result.insertedId,
			iat: parseInt(now.getTime() / 1000),
			exp: parseInt(expDate.getTime() / 1000)
		}, s);

		res.status(200);
		res.json({'token': token});
	}).catch(function(err) {
		// Handle any unknown errors
		if(err !== 'Email conflict' || err !== 'Create error') {
			res.status(500);
			res.json({'message': 'Server error (' + err + ')'});
		}
	});
};
