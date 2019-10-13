'use strict';

var path 		 = require('path');
var electron 	 = require('electron');

const {app} = electron;

// Database Path For Sqlite Client 
exports.appDir  = path.join(app.getPath('userData'), '');
exports.dbDir   = path.join(app.getPath('userData'), './database');
exports.dbPath  = path.join(app.getPath('userData'), './database/database.sqlite'); 

// Connection Client
exports.dbClient = process.env.DB_CLIENT || 'sqlite3';

// Connection Config
exports.dbConn = {
  sqlite3: {

    filename: path.join(app.getPath('userData'), './database/database.sqlite')
  },
  pg: process.env.PG_CONNECTION_STRING
};

// Connection To Database
exports.connectDb = function(client,connection){

	return require('knex')({
	  client: client,
	  connection: connection,
	  useNullAsDefault: true
	});
};