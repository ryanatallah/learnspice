var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');

module.exports = {
    getAll: function(noteid, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('lines');
            collection.find({noteid: noteid}).toArray(function (err, results) {
                console.dir(results);
                db.close();
                callback(results);
            });
        });
    },
    create: function(noteid, sectionid, userid, content, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var date_created = new Date();

            var collection = db.collection('lines');
            collection.insert({
                noteid: noteid,
                sectionid: sectionid,
                userid: userid,
                content: content,
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
    changeContent: function(lineid, content, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('lines').update({_id: new ObjectId(lineid)}, {$set: {content: content}}, function(err, results) {
                console.dir(results);
                db.close();
                callback(results);
            });
        });
    }
};
