var user = require('./user.js');
var note = require('./note.js');

module.exports = function(socket) {

    socket.on('authenticate:user', function(data) {
        user.authenticate(data.username, data.password, function(results) {
            if (results) {
                socket.emit('authenticate:user', {userid: results._id});
            }
        });
    });

    socket.on('create:user', function(data) {
        user.create(data.username, data.email, data.password, function(results) {
            if (results) {
                socket.emit('create:user', {userid: results._id});
            }
        });
    });

    socket.on('create:note', function(data) {
        note.create(data.title, data.userid, function(results) {
            if (results) {
                socket.emit('create:note', {shortlink: results.shortlink});
            }
        });
    });

    socket.on('create:section', function(data) {
    });

    socket.on('create:line', function(data) {

    });
};
