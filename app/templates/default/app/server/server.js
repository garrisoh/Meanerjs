'use strict';

/**
 *
 */

var path = require('path');
var fs = require('fs');

// Load package.json for config info
var pkg = JSON.parse(fs.readFileSync(__dirname + '/../../package.json'), 'utf8');

// Load express
var express = require('express');
var app = express();

// Add json parser to express
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// TODO: Fire up mongo indexing if not already exists


// ******* Api Routing ******* //

// Use separate router for api and mount restful routes to api url
var api = express.Router();
app.use('/api', api);

api.post('/register', require('./register'));
api.post('/login', require('./login'));
api.post('/reset', require('./reset'));

// Secured api endpoints
api.use('/user', require('./auth'));

api.get('/user', require('./user'));
api.post('/user', require('./user'));


// ******* Page Routing ******* //
// TODO: How to handle not modified/caching
app.use('/reset.html', require('./resetAuth'));

app.use('/', express.static(path.resolve(__dirname + '/../client/index'))); // index.html
app.use('/', express.static(path.resolve(__dirname + '/../client'))); // majority of files served wrt client dir
app.use('/', express.static(path.resolve(__dirname + '/../..'))); // Bower components



// Start server
app.listen(pkg.port, function() {
	console.log('Server listening on port ' + pkg.port);
});
