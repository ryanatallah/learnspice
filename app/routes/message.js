
var MongoClient = require('mongodb').MongoClient;

module.exports = {

    getAll: function(note_id, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('messages').find({"note_id" : note_id}).toArray(function(err, docs) {
                console.log(docs);
                callback(docs);
            });
        });
    },

    create: function(note_id, user_id, contents, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var date_created = new Date();

            console.log('message received: ' + contents);
            
            var collection = db.collection('messages');
            collection.insert({
                note_id: note_id,
                user_id: user_id,
                contents: contents,
                date_created: date_created
            },
            
            function(err, docs) {
                console.dir(docs);
                db.close();
                callback(docs);
            });
        });
    }
};
