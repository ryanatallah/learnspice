var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');

module.exports = {
    authenticate: function(username, password, callback) {
        MongoClient.connect('mongodb://127.0.0.1:27017/learnspice', function(err, db) {
            if (err) {
                throw err;
            }

            collection.find({username: username}).toArray(function(err, results) {
                console.dir(results);
                
                var salt = results.salt;
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
    }
};
