/*
 * Serve JSON to our AngularJS client
 */

var message = require('./message.js');

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};
