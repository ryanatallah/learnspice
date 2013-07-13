/*
 * Serve JSON to our AngularJS client
 */

var message = require('./message.js');

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.note = function (req, res) {
	var sl = req.params.shortlink;
	var result;
	if (sl) {
		MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('notes').find({"shortlink" : sl}).toArray(function(err, docs) {
                result = docs[0];
                console.log(result);
            });
        });
		res.json({
			note: result
		});
	}
}