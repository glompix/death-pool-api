var mysql = require('mysql');
var config = require('./settings');

module.exports = mysql.createPool(config.connection);
