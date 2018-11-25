'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

var dds = ['htdd', 'cldd'];

var map_dd = function(row, dd){
	var parts = row.split(/\s+/),
		station_id = parts[0],
		stat = parts[1],
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_amount = Number(stat_parts[1]) / 10,
		stat_flag = stat_parts[2];

	var data = {
		station_id: station_id
	};

	data['ann_' + dd] = {
		value: stat,
		amount: stat_amount,
		flag: stat_flag
	};

	return data;
};

dds.forEach(function(dd){
	var file_path = config.noaa_path + 'products/temperature/ann-' + dd + '-normal.txt';
	console.log(file_path);
	fs.readFile(file_path, 'utf8', function(err, data){
		if (err) throw err;

		var rows = data.split('\n').filter(r => r.length);

		var dd_objs = rows.map(function(row){
			return map_dd(row, dd);
		});

		// ---

		dd_objs.forEach(function(dd_obj){
			console.log(dd_obj);
			Station.updateOne({station_id: dd_obj.station_id}, dd_obj, {upsert: true}, function(err){
				if( err ) {
					console.log(err);
					return;
				}
			});
		})

		
	});
});