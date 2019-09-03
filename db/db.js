const MongoClient = require('mongodb').MongoClient;

const config = require('../config');

var connect = function(callback){
	MongoClient.connect(config.db_config.url, function(err, client) {
		if( err ) {
			throw err;
		}
		callback(client);
	});
}

module.exports = {
	MongoClient: MongoClient,
	url: config.db_config.url,
	connect: connect
};
