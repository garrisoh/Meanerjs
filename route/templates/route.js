'use strict';

/**
 *
 */

module.exports = function(req, res) {
	// Include the next parameter for middleware and both the next and err parameters for error handling
	res.status(200);
	res.json({foo: 'bar'});
};
