'use strict';
/**
 * This module exposes the most commonly used mongodb operations for CRUD and indexing.
 * It handles the connection to the database server and returns promises that can be used
 * to retrieve the results of the operations.
 */

//TODO: Find and delete etc.
//TODO: Index fields in config file, check if index exists in server.js
//TODO: Comment individual functions, author, date, etc.
//TODO: Unit test this
//TODO: Can I use result.connection object to close without doing this?

// Load requirements
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

// Get package for app name
var pkg = JSON.parse(fs.readFileSync(__dirname + '/../../package.json'), 'utf8');

// Database URL
var url = 'mongodb://localhost:27017/' + pkg.name;

// Promises for connecting to and closing db
var connect = function() {
	return MongoClient.connect(url);
};

var close = function(db, r) {
	var returnVal = function() {
		return r;
	}
	return db.close().then(returnVal);
};

// CRUD operations
module.exports.createOne = function(coll, doc, options) {
	// InsertOne promise using given collection and document
	var insertOne = function(db) {
		return db.collection(coll).insertOne(doc, options).then(close.bind(null, db));
	};

	return connect().then(insertOne);
};

module.exports.createMany = function(coll, docs, options) {
	// InsertMany promise
	var insertMany = function(db) {
		return db.collection(coll).insertMany(docs, options).then(close.bind(null, db));
	};

	return connect().then(insertMany);
};

module.exports.readOne = function(coll, query, options) {
	// FindOne promise
	var findOne = function(db) {
		return db.collection(coll).findOne(query, options).then(close.bind(null, db));
	};

	return connect().then(findOne);
};

module.exports.readMany = function(coll, query, options) {
	// FindMany promise
	var find = function(db) {
		//var f = db.collection(coll).find(query);
		var f = db.collection(coll).find(query);

		// Handle options
		if(options) {
			if(options.skip) f = f.skip(options.skip);
			if(options.limit) f = f.limit(options.limit);
			if(options.sort) f = f.sort(options.sort);
			if(options.fields) f = f.project(options.fields);
			if(options.hint) f = f.hint(options.hint);
			if(options.snapshot) f = f.snapshot(options.snapshot);
			if(options.maxTimeMS) f = f.maxTimeMS(options.maxTimeMS);
			if(options.batchSize) f = f.batchSize(options.batchSize);
			if(options.returnKey) f = f.returnKey(options.returnKey);
			if(options.maxScan) f = f.maxScan(options.maxScan);
			if(options.max) f = f.max(options.max);
			if(options.min) f = f.min(options.min);
			if(options.collation) f = f.collation(options.collation);
			if(options.comment) f = f.comment(options.comment);

			// Flags and modifiers
			if(options.cursorFlags) {
				for(var flag in options.cursorFlags) {
					f = f.addCursorFlag(flag, options.cursorFlags[flag]);
				}
			}

			if(options.queryModifiers) {
				for(var mod in options.queryModifiers) {
					f = f.addQueryModifier(mod, options.queryModifiers[mod]);
				}
			}

			// Handle output
			if(options.explain) f = f.explain();
			else f = f.toArray();
		} else {
			f = f.toArray();
		}

		return f.then(close.bind(null, db));
	};

	return connect().then(find);
};

module.exports.updateOne = function(coll, doc, ud, options) {
	// UpdateOne promise
	var updateOne = function(db) {
		return db.collection(coll).updateOne(doc, ud, options).then(close.bind(null, db));
	};

	return connect().then(updateOne);
};

module.exports.updateMany = function(coll, docs, ud, options) {
	// UpdateOne promise
	var updateOne = function(db) {
		return db.collection(coll).updateOne(docs, ud, options).then(close.bind(null, db));
	};

	return connect().then(updateOne);
};

module.exports.deleteOne = function(coll, doc, options) {
	// DeleteOne promise
	var deleteOne = function(db) {
		return db.collection(coll).deleteOne(doc, options).then(close.bind(null, db));
	};

	return connect().then(deleteOne);
};

module.exports.deleteMany = function(coll, docs, options) {
	// DeleteMany promise
	var deleteMany = function(db) {
		return db.collection(coll).deleteMany(docs, options).then(close.bind(null, db));
	};

	return connect().then(deleteMany);
};

// Indexing
module.exports.index = function(coll, fieldOrSpec, options) {
	// CreateIndex promise
	var createIndex = function(db) {
		return db.collection(coll).createIndex(fieldOrSpec, options).then(close.bind(null, db));
	};

	return connect().then(createIndex);
};

module.exports.indexExists = function(coll, indices) {
	// IndexExists promise
	var indexExists = function(db) {
		return db.collection(coll).indexExists(indices).then(close.bind(null, db));
	};

	return connect().then(indexExists);
};
