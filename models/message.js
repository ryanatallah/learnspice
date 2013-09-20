var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('127.0.0.1/learnspice', ['messages']);

module.exports = {
    getAll: function(note_id, callback) {
        db.messages.find({"note_id" : note_id}).toArray(function(err, docs) {
            console.log(docs);
            callback(docs);
        });
    },
    create: function(note_id, user_id, contents, callback) {
        var date_created = new Date();
        console.log('message received: ' + contents);
        db.messages.insert({
            note_id: note_id,
            user_id: user_id,
            contents: contents,
            date_created: date_created
        }, function(err, docs) {
            console.dir(docs);
            callback(docs);
        });
    }
};
