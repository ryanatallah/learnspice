
var MongoClient = require('mongodb').MongoClient;

module.exports = {
    create: function(note_id, user_id, contents, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var date_created = new Date();

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
