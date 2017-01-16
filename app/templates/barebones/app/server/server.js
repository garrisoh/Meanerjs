'use strict';

/**
 * This is the main server file that defines all route urls.
 */

var path = require('path');
var fs = require('fs');

// Load configuration params (for port number)
var config = require('../../config.json');

// Load express
var express = require('express');
var app = express();

// Add json parser to express
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Routes
app.use('/', express.static(path.resolve(__dirname + '/../client/index'))); // index.html and required resources
app.use('/', express.static(path.resolve(__dirname + '/../client'))); // pages other than index
app.use('/', express.static(path.resolve(__dirname + '/../..'))); // Bower components

// Start server
app.listen(config.port, function() {
	console.log('Server listening on port ' + config.port);
});
