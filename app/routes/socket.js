var user = require('./user.js');
var note = require('./note.js');
var message = require('./message.js');

module.exports = function(sockets, socket) {

    // User Stuff

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
            user.validUsername(data.username, function(result) {
                if(result) {
                    user.create(data.username, data.email, data.password, function(results) {
                        if (results.length) {
                            socket.emit('create:user', {
                                userid: results[0]._id,
                                username: results[0].username
                            });
                        }
                    });
                } else {
                    user.authenticate(data.username, data.password, function(results) {
                        if (results.length) {
                            user.transfer(data.userid, results[0]._id);
                            socket.emit('authenticate:user', {
                                userid: results[0]._id,
                                username: results[0].username
                            });
                        }
                    });
                }
            });
        });
    });



    // Note Stuff

    socket.on('create:note', function(data) {
        note.create(data.title, data.userid, function(results) {
            if (results.length) {
                sockets.emit('create:note', {
                    noteid: results[0]._id,
                    title: results[0].title,
                    hash: results[0].hash,
                    shortlink: results[0].shortlink
                });
            }
        });
    });

    socket.on('change:notetitle', function(data) {
        note.validOwner(data.noteid, data.userid, function(results) {
            note.changeTitle(data.noteid, data.title, function(results) {
                sockets.emit('change:notetitle', {
                    noteid: results[0]._id,
                    title: results[0].title,
                    hash: results[0].hash,
                    shortlink: results[0].shortlink
                });
            });
        });
    });

    socket.on('delete:note', function(data) {
        note.validOwner(data.noteid, data.userid, function(results) {
            note.delete(data.noteid, function() {
                sockets.emit('delete:note', {
                    noteid: results[0]._id
                });
            });
        });
    });



    // Section Stuff

    socket.on('create:section', function(data) {
        // TODO
    });



    // Line Stuff

    socket.on('create:line', function(data) {
        // TODO
    });



    // Chat Stuff

    socket.on('load:messages', function(data) {
        message.getAll(data.noteid, function(results) {
            // TODO replace 1 with actual noteid
            if (results) {
                socket.emit('send:messages', {
                    messages: results
                });
            }
        });
    });

    socket.on('create:message', function(data) {
        message.create(data.note_id, data.user_id, data.contents, function(results) {
            if (results) {
                sockets.emit('create:message', {
                    contents: results[0].contents
                });
            }
        });
    });
};
