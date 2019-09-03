'use strict';

const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

var map_stations = function(row){
	var data = {
		station_id: row.slice(0, 11).trim(),
		latitude: Number(row.slice(12, 20).trim()),
		longitude: Number(row.slice(21, 30).trim()),
		elevation: Number(row.slice(31, 37).trim()),
		state: row.slice(38, 40).trim(),
		name: row.slice(41, 71).trim(),
		gsnflag: row.slice(72, 75).trim(),
		hcnflag: row.slice(76, 79).trim(),
		wmoid: row.slice(80, 85).trim(),
		method: row.slice(86, 99).trim()
	};

	data.location = {
		type: 'Point',
		coordinates: [data.longitude, data.latitude]
	};

	return data;
};


var total_count = 0,
	done_count = 0;

var file_path = config.noaa_path + 'station-inventories/allstations.txt';
fs.readFile(file_path, 'utf8', function(err, data){
	if (err) throw err;


	var rows = data.split('\n').filter(r => r.length);
	var stations = rows.map(map_stations);

	total_count = rows.length;

	stations.forEach(function(station){
		Station.updateOne({station_id: station.station_id}, station, {upsert: true}, function(err){
			if( err ) {
				console.log(err);
				return;
			}
			done_count++;
			if( done_count % 100 == 0){
				console.log('working: ' + (done_count/total_count))
			}
			if( done_count == total_count ){
				console.log('done')
			}
			console.log(station.station_id);
		});
	});

});