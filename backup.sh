# mongodump -h ds021326.mlab.com:21326 -d city-data-v3 -u noaa -p *** -o ./data/backups/
# mongoexport -h ds021326.mlab.com:21326 -d city-data-v3 -c stations -u noaa -p *** -o ./data/stations.json
mongoexport -h ds145146.mlab.com:45146 -d city-data-v2 -c cities -u noaa -p *** -o ./data/cities.json