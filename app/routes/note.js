var MongoClient = require('mongodb').MongoClient;

module.exports = {
    create: function(title, userid, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var shortlink = ''; // TODO: shortlink generation
            var collaborators = [userid];
            var date_created = new Date();

            var collection = db.collection('notes');
            collection.insert({
                title: title,
                userid: userid,
                shortlink: shortlink,
                collaborators: collaborators,
                date_created: date_created,
                date_updated: date_created
            },
            function(err, docs) {
                console.log(docs.pretty());
            });
        });
    }
};
