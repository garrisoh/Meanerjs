'use strict';

/**
 *
 */

var db = require('./db');
var ObjectId = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');

module.exports = function(req, res) {
	// Read user id from token
	var token = req.headers.authorization.split(' ')[1];
	var decoded = jwt.decode(token);

	if(req.method === 'GET') {
		// Get user from database
		db.readOne('users', {_id: new ObjectId(decoded.uid)}, {fields: {password: 0, validFrom: 0}})
			.then(function(user) {
				if(user == null) throw 'Not Found';
				res.status(200);
				res.json(user);
			}).catch(function(err) {
				if(err === 'Not Found') {
					res.status(404);
					res.json({'message': 'User not found in database'});
				} else {
					res.status(500);
					res.json({'message': 'Server Error: ' + err});
				}
			});
	} else {
		// Validate fields
		var fields = Object.keys(req.body);
		for(var i = 0; i < fields.length; i++) {
			if(req.body[fields[i]] === '') {
				res.status(400);
				res.json({'message': 'Field "' + fields[i] + '" must not be blank'});
				return;
			}

			if(fields[i] === 'email' && !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(req.body[fields[i]])) {
				res.status(400);
				res.json({'message': 'Invalid email address'});
				return;
			}
		}

		// Update user fields
		db.updateOne('users', {_id: new ObjectId(decoded.uid)}, {$set: req.body})
			.then(function() {
				res.status(200);
				res.json({});
			}).catch(function(err) {
				res.status(500);
				res.json({'message': 'Server Error (' + err + ')'});
			});
	}
};
