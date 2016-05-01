var db = require('../db/db');

var character = {};

character.getAll = function getAll(callback) {
	db.query('select * from characters', [], function (error, data) {
		callback(error, data);
	});
};

module.exports = character;
