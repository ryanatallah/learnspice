var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');

module.exports = {
    validOwner: function(noteid, userid, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('notes');
            collection.find({
                _id: new ObjectId(noteid),
                userid: userid
            },
            function(err, results) {
                console.dir(results);
                db.close();
                if(results.length) {
                    callback();
                }
            });
        });
    },
    create: function(title, userid, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var md5 = crypto.createHash("md5");
            md5.update(new Date().toJSON(), 'utf8');
            var hash = md5.digest('base64');

            var md5 = crypto.createHash("md5");
            md5.update(new Date().toJSON() + 'shortlink', 'utf8');
            var shortlink = md5.digest('base64');

            var collaborators = [userid];
            var date_created = new Date();

            var collection = db.collection('notes');
            collection.insert({
                title: title,
                userid: userid,
                hash: hash,
                shortlink: shortlink,
                collaborators: collaborators,
                date_created: date_created,
                date_updated: date_created
            },
            function(err, docs) {
                console.dir(docs);
                db.close();
                callback(docs);
            });
        });
    },
    changeTitle: function(noteid, title, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('notes').update({_id: new ObjectId(noteid)}, {$set: {title: title}}, function(err, results) {
                console.dir(results);
                db.close();
                callback(results);
            });
        });
    },
    delete: function(noteid, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('notes').remove({_id: new ObjectId(noteid)}, function(err, results) {
                console.dir(results);
                db.close();
                callback();
            });
        });
    }
};
