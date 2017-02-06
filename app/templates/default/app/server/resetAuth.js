'use strict';

/**
 *
 */

var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	// Verify token
	var s = process.env.MEANTUT_RSTK;
	var decoded = null;
	try {
		var token = req.headers.authorization.split(' ')[1];
		decoded = jwt.verify(token, s);
	} catch(err) {
		res.status(403);
		res.json({'message': 'Invalid reset token'});
		return;
	}

	next();
};
