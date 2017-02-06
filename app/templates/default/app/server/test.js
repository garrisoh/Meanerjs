'use strict';

// Sendinblue
require('mailin-api-node-js');
var mailer = new Mailin('https://api.sendinblue.com/v2.0', process.env.SENDINBLUE_API, 5000);
mailer.send_email({
	from: ['no-reply@meanerjs.com', 'Meanerjs'],
	to: {'hgarriso@gmail.com': 'Haley Garrison'},
	subject: 'Hello, Sendinblue',
	html: '<h1>This is a Message</h1><p>Sent from you via SendInBlue!</p>'
});

/*
// Nodemailer
var nm = require('nodemailer');

var transport = nm.createTransport('smtps://hgarriso%40gmail.com:Tr1gger1@smtp.gmail.com');
transport.sendMail({
	from: 'Meanerjs <no-reply@meanerjs.com>',
	to: 'hgarriso@gmail.com',
	subject: 'Test',
	text: 'Testing 123',
	html: '<h1>Testing 123</h1>'
}).catch(function(err) {
	console.log(err);
});
*/

/*
// Callbacks
var db = require('./db.js');

var logInserted = function(inserted) {
	console.log('Inserted: ');
	for(var i in inserted) {
		console.log(inserted[i]);
	}
};

var logFound = function(found) {
	console.log('Found: ');
	console.log(found);
};

// Insert data, log the results, find all of the Garrisons' first names, and log them
var toInsert = [{firstname: 'Haley', lastname: 'Garrison'},
				{firstname: 'Beth', lastname: 'Garrison'},
				{firstname: 'foo', lastname: 'bar'}];

db.createMany('test', toInsert)
	.then(logInserted)
	.then(db.readMany.bind(null, 'test', {lastname: 'Garrison'}, {fields: {firstname: 1}}))
	.then(logFound)
	.catch(function(err) { console.log(err); });
*/
