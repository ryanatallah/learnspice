var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('127.0.0.1/learnspice', ['users']);

var transformId = function(query) {
	if(query._id) {
		query._id = ObjectId(query._id);
	}
	return query;
};

module.exports = {
	find: function(query, callback) {
		db.users.find(transformId(query), callback);
	},
	update: function(userdata, callback) {
		var query = {id: userdata.id, provider: userdata.provider};
		db.users.update(query, {$set: userdata}, {upsert: true}, function(err) {
			module.exports.find(query, callback);
		});
	}
};