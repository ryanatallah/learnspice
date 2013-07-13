var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');

module.exports = {
    getAll: function(noteid, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('sections');
            collection.find({noteid: noteid}).toArray(function (err, results) {
                console.dir(results);
                db.close();
                callback(results);
            });
        });
    },
    create: function(noteid, userid, header, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var date_created = new Date();

            var collection = db.collection('sections');
            collection.insert({
                noteid: noteid,
                header: header,
                userid: userid,
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
    changeHeader: function(sectionid, header, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('sections').update({_id: new ObjectId(noteid)}, {$set: {title: title}}, function(err, results) {
                console.dir(results);
                db.close();
                callback(results);
            });
        });
    }
};
