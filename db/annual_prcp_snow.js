'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const mongoose = require('mongoose');

var db_config = require('./db.js');
mongoose.connect( db_config.url, { useNewUrlParser: true });
var Station = require('./schema.station.js');

// ---

const prcp_symbols = ['prcp', 'snow'];

var map_row = function(row, prcp){
	var parts = row.split(/\s+/),
		station_id = parts[0].trim(),
		stat = parts[1].trim(),
		stat_parts = stat.match(/([-]?\d+)(\w+)/),
		stat_divisor = prcp === 'snow' ? 10 : 100,
		stat_amount = Number(stat_parts[1]) / stat_divisor,
		stat_flag = stat_parts[2];

	var data = {
		station_id: station_id.trim(),
	};

	var stat_key = 'ann_' + prcp;

	data[stat_key] = {
		value: stat.trim(),
		amount: stat_amount,
		flag: stat_flag.trim()
	};

	return data;
};

var count_total = 0,
	count_done = 0;

prcp_symbols.forEach(function(prcp, prcp_i){

	var file_path = config.noaa_path + 'products/precipitation/ann-' + prcp + '-normal.txt';
	fs.readFile(file_path, 'utf8', function(err, data){

		if (err) throw err;
		
		var rows = data.split('\n').filter(r => r.length);

		var prcp_datas = rows.map(function(prcp_data){
			return map_row(prcp_data, prcp);
		});

		count_total += prcp_datas.length

		prcp_datas.forEach(function(prcp_data){
			Station.updateOne({station_id: prcp_data.station_id}, prcp_data, {upsert: true}, function(err){
				if( err )  throw err

				count_done++
				if( count_done % 100 ){
					console.log('Done with: ' + count_done + ' out of: ' + count_total);
					console.log(prcp_data.station_id, prcp);
				}
				if( count_done / count_total > 0.9 ){
					console.log('Almost done')
				}
				if( count_done == count_total ){
					console.log('Done')
				}
			});
		});
	});
});