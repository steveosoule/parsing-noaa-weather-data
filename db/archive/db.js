const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const db_user = 'node_user';
const db_password = '********';
const url = `mongodb://${db_user}:${db_password}@ds157599.mlab.com:57599/city-data`;

var connect = function(callback){
	MongoClient.connect(url, function(err, client) {
		if( err ) {
			throw err;
		}
		callback(client);
	});
}

module.exports = {
	MongoClient: MongoClient,
	url: url,
	connect: connect
};
