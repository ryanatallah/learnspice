var user = require('./user.js');
var note = require('./note.js');
var message = require('./message.js');

module.exports = function(sockets, socket) {

    socket.on('check:tempuser', function(data) {
        user.validTemp(data.userid, data.username, function() {
            socket.emit('check:tempuser', data);
        });
    });

    socket.on('check:user', function(data) {
        user.valid(data.userid, data.username, function() {
            socket.emit('check:user', data);
        });
    });

    socket.on('authenticate:user', function(data) {
        user.authenticate(data.username, data.password, function(results) {
            if (results.length) {
                socket.emit('authenticate:user', {
                    userid: results[0]._id,
                    username: results[0].username
                });
            }
        });
    });

    socket.on('create:tempuser', function(data) {
        user.createTemp(function(results) {
            if (results.length) {
                socket.emit('create:tempuser', {
                    userid: results[0]._id,
                    username: results[0].username
                });
            }
        });
    });

    socket.on('create:user', function(data) {
        user.validTemp(data.userid, data.oldUsername, function(){
            user.validUsername(data.username, function() {
                user.create(data.username, data.email, data.password, function(results) {
                    if (results.length) {
                        socket.emit('create:user', {
                            userid: results[0]._id,
                            username: results[0].username
                        });
                    }
                });
            });
        });
    });

    socket.on('create:note', function(data) {
        note.create(data.title, data.userid, function(results) {
            if (results.length) {
                socket.emit('create:note', {
                    title: results[0].title,
                    shortlink: results[0].shortlink
                });
            }
        });
    });

    socket.on('create:section', function(data) {
        // TODO
    });

    socket.on('create:line', function(data) {
        // TODO
    });


    // Chat
    socket.on('create:message', function(data) {
        message.create(data.note_id, data.user_id, data.contents, function(results) {
            if (results) {
                socket.emit('create:message', {
                    contents: results[0].contents
                });
            }
        });
    });
};
