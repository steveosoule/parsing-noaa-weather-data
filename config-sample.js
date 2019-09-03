const noaa_path = './data/www1.ncdc.noaa.gov/pub/data/normals/1981-2010/';

let db_config = {
	user: 'foo',
	password: 'bar',
	url: null
};

db_config.url = `mongodb://${db_config.user}:${db_config.password}@ds12345.mlab.com:123456/foo-bar`;

module.exports = {
	noaa_path,
	db_config
}