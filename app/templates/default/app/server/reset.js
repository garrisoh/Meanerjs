'use strict';

/**
 *
 */

var db = require('./db');
var ObjectId = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('mailin-api-node-js');

// TODO: Change hostname, from address depending on config file
module.exports = function(req, res, next) {
	// If an email is provided, send an email with the reset link, otherwise reset the password
	if(req.body.email != null) {
		// Check that email exists in database
		db.readOne('users', {email: req.body.email}, {fields: {_id: 1, firstname: 1, lastname: 1}})
			.then(function(user) {
				if(user == null) throw 'Invalid Email';

				// Create password reset token with separate secret
				var s = process.env.MEANTUT_RSTK;
				var expDate = new Date();
				expDate.setDate(expDate.getDate() + 1);
				var token = jwt.sign({
					uid: user._id,
					exp: parseInt(expDate.getTime() / 1000)
				}, s);

				// Formulate message
				var mailer = new Mailin('https://api.sendinblue.com/v2.0', process.env.SENDINBLUE_API, 5000);
				var toAddress = {};
				toAddress[req.body.email] = user.firstname + ' ' + user.lastname;
				mailer.send_email({
					from: ['no-reply@meanerjs.com', 'Meanerjs'],
					to: toAddress,
					subject: 'Meanerjs Password Reset Link',
					text: 'Meanerjs Password Reset Request\n\nThe account associated with this email requested a password reset.  To reset your password, click the link below.  The link will expire in 24 hours.  If you did not request a password reset, please disregard this email.\n\nhttp://localhost:9000/#!/reset/' + token,
					html: '<h1>Meanerjs Password Reset Request</h1><p>The account associated with this email requested a password reset.  To reset your password, click the link below.  The link will expire in 24 hours.  If you did not request a password reset, please disregard this email.</p><a href="http://localhost:9000/#!/reset/' + token + '">Reset Password</a>'
				}).on('complete', function(data) {
					var result = JSON.parse(data);
					if(result.code !== 'success') {
						res.status(500);
						res.json({'message': 'Email Error (' + result.message + ')'});
					} else {
						res.status(200);
						res.json({});
					}
				});
			}).catch(function(err) {
				if(err == 'Invalid Email') {
					res.status(404);
					res.json({'message': 'Invalid Email: No account exists with the provided email'});
				} else {
					res.status(500);
					res.json({'message': 'Server Error (' + err + ')'});
				}
			});
	} else {
		// Validate token
		var decoded = null;
		try {
			var token = req.headers.authorization.split(' ')[1];
			decoded = jwt.verify(token, process.env.MEANTUT_RSTK);
		} catch(err) {
			console.log(err);
			res.status(403);
			res.json({'message': 'Server failed to authenticate the request.  Make sure the value of the Authorization header is formed correctly including the signature.'});
			return;
		}

		// Reset the password
		var salt = crypto.randomBytes(16).toString('hex');
		var validFrom = new Date();
		db.updateOne('users', {_id: new ObjectId(decoded.uid)}, {$set: {
			salt: salt,
			hash: crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha1').toString('hex'),
			validFrom: parseInt(validFrom.getTime() / 1000)
		}}).then(function() {
			res.status(200);
			res.json({});
		}).catch(function(err) {
			res.status(500);
			res.json({'message': 'Server Error (' + err + ')'});
		});
	}

};
