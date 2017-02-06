'use strict';

/**
 *
 */

var db = require('./db');
var ObjectId = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	// Check that token is signed correctly and not expired
	var s = process.env.MEANTUT_TK;
	var decoded = null;
	try {
		// This will throw an error if verification fails.
		var token = req.headers.authorization.split(' ')[1];
		decoded = jwt.verify(token, s);
	} catch(err) {
		res.status(403);
		res.json({'message': 'Server failed to authenticate the request.  Make sure the value of the Authorization header is formed correctly including the signature.'});
		return;
	}

	// Check that password has not changed since issuing the token
	db.readOne('users', {_id: new ObjectId(decoded.uid)}, {fields: {validFrom: 1}})
		.then(function(user) {
			if(user == null) throw 'User error: The requested user does not exist.';
			if(user.validFrom > decoded.iat) throw 'Invalid error';
			next();
		}).catch(function(err) {
			if(err == 'Invalid error') {
				res.status(403);
				res.json({'message': 'Server failed to authenticate the request.  Make sure the value of the Authorization header is formed correctly including the signature.'});
			} else {
				res.status(500);
				res.json({'message': 'Server error (' + err + ')'});
			}
		});
};
