var user = require('./user.js');
var note = require('./note.js');

module.exports = function(socket) {

    socket.on('authenticate:user', function(data) {
        user.authenticate(data.username, data.password, function(results) {
            if (results) {
                socket.emit('authenticate:user', {
                    userid: results[0]._id,
                    username: results[0].username
                });
            }
        });
    });

    socket.on('create:user', function(data) {
        user.create(data.username, data.email, data.password, function(results) {
            if (results) {
                socket.emit('create:user', {
                    username: results[0].username
                });
            }
        });
    });

    socket.on('create:note', function(data) {
        note.create(data.title, data.userid, function(results) {
            if (results) {
                socket.emit('create:note', {shortlink: results[0].shortlink});
            }
        });
    });

    socket.on('create:section', function(data) {
    });

    socket.on('create:line', function(data) {

    });
};
