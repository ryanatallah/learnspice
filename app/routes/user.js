var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');

module.exports = {
    authenticate: function(username, password, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('users');
            collection.find({username: username}).toArray(function(err, results) {
                console.dir(results);

                var salt = results[0].salt;
                var sha256 = crypto.createHash("sha256");
                sha256.update(password + salt, 'utf8');
                var password_hash = sha256.digest('base64');

                collection.find({
                    username: username,
                    password_hash: password_hash
                }).toArray(function(err, results) {
                    console.dir(results);
                    db.close();
                    callback(results);
                });
            });
        });
    },
    getAll: function(callback) {
        // TODO
    },
    getById: function(id, callback) {
        // TODO
    },
    validUsername: function(username, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('users');
            collection.find({username: username}).toArray(function(err, results) {
                console.dir(results);
                if(!results.length){
                    callback();
                }
            });
        });
    },

    // WARNING: THIS IS NOT A SECURE METHOD. USERID SHOULD BE REPLACED BY SOME RANDOM CODE.
    valid: function(userid, username, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('users');
            collection.find({
                _id: new ObjectId(userid),
                username: username
            }).toArray(function(err, results) {
                console.dir(results);
                if(results.length){
                    callback();
                }
            });
        });
    },

    // WARNING: THIS IS NOT A SECURE METHOD. USERID SHOULD BE REPLACED BY SOME RANDOM CODE.
    validTemp: function (userid, username, callback){
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var collection = db.collection('users');
            collection.find({
                _id: new ObjectId(userid),
                username: username,
                email: '',
                salt: '',
                password_hash: ''
            }).toArray(function(err, results) {
                console.dir(results);
                if(results.length){
                    callback();
                }
            });
        });
    },
    createTemp: function(callback){
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var md5 = crypto.createHash("md5");
            md5.update(new Date().toJSON() + 'hash', 'utf8');
            var username = md5.digest('base64');
            var date_created = new Date();

            var collection = db.collection('users');
            collection.insert({
                username: username,
                email: '',
                salt: '',
                password_hash: '',
                date_created: date_created,
                date_latest: date_created
            },
            function(err, docs) {
                console.dir(docs);
                db.close();
                callback(docs);
            });
        });
    },
    create: function(username, email, password, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            var md5 = crypto.createHash("md5");
            md5.update(new Date().toJSON(), 'utf8');
            var salt = md5.digest('base64');

            var sha256 = crypto.createHash("sha256");
            sha256.update(password + salt, 'utf8');
            var password_hash = sha256.digest('base64');

            var date_created = new Date();

            var collection = db.collection('users');
            collection.insert({
                username: username,
                email: email,
                salt: salt,
                password_hash: password_hash,
                date_created: date_created,
                date_latest: date_created
            },
            function(err, docs) {
                console.dir(docs);
                db.close();
                callback(docs);
            });
        });
    },
    // TODO: MAKE SURE ALL STUFF ASSOCIATED WITH userid_from IS TRANSFERED TO userid_to.
    transfer: function(userid_from, userid_to, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }
            db.collection('notes').update({userid: userid_from}, {$set: {userid: userid_to}, function(err, docs) {
                db.close();
            });
            db.collection('sections').update({userid: userid_from}, {$set: {userid: userid_to}, function(err, docs) {
                db.close();
            });
            db.collection('lines').update({userid: userid_from}, {$set: {userid: userid_to}, function(err, docs) {
                db.close();
            });
            db.collection('attachments').update({userid: userid_from}, {$set: {userid: userid_to}, function(err, docs) {
                db.close();
            });
            db.collection('messages').update({userid: userid_from}, {$set: {userid: userid_to}, function(err, docs) {
                db.close();
            });
            db.collection('users').remove({userid: userid_from}, function(err, docs) {
                db.close();
            });
            callback();
        });
    }
};
