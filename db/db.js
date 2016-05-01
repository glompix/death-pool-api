var settings = require('./settings');
var mysqlPool = require('./mysqlPool');

db = {};

db.query = function query(query, args, callback) {
	mysqlPool.getConnection(function (err, c) {
    if (err) callback(err);
    c.query(query, args, callback);
	});
};

module.exports = db;
