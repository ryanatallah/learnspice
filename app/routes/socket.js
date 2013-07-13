var user = require('./user.js');
var note = require('./note.js');
var section = require('./section.js');
var line = require('./line.js');
var message = require('./message.js');

module.exports = function(sockets, socket) {

    // User Stuff

    socket.on('check:tempuser', function(data) {
        user.validTemp(data.userid, data.username, function(results) {
            if (results) {
                socket.emit('check:tempuser', {
                    userid: results[0]._id,
                    username: results[0].username
                });
            } else {
                socket.emit('check:tempuser', results);
            }
        });
    });

    socket.on('check:user', function(data) {
        user.valid(data.userid, data.username, function(results) {
            if (results) {
                socket.emit('check:user', {
                    userid: results[0]._id,
                    username: results[0].username
                });
            } else {
                socket.emit('check:user', results);
            }
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
            console.log('fail');
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
                    user.create(data.userid, data.username, data.email, data.password, function(results) {
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
                            user.transfer(data.userid, results[0]._id, function () {
                                socket.emit('authenticate:user', {
                                    userid: results[0]._id,
                                    username: results[0].username
                                });
                            });
                        }
                    });
                }
            });
        });
    });



    // Note Stuff

    socket.on('get:note', function(data) {
        note.get(data.shortlink, function(results) {
            if (results) {
                socket.join(data.shortlink);
                socket.emit('get:note', {
                    noteid: results[0]._id,
                    title: results[0].title,
                    shortlink: results[0].shortlink
                });
            } else {
                socket.emit('get:note', results);
            }
        });
    });

    socket.on('create:note', function(data) {
        note.create(data.title, data.userid, function(results) {
            if (results.length) {
                socket.emit('create:note', {
                    noteid: results[0]._id,
                    title: results[0].title,
                    shortlink: results[0].shortlink
                });
            }
        });
    });

    socket.on('change:notetitle', function(data) {
        note.validOwner(data.noteid, data.userid, function(results) {
            note.changeTitle(data.noteid, data.title, function(results) {
                sockets.in(results[0].shortlink).emit('change:notetitle', {
                    noteid: results[0]._id,
                    title: results[0].title,
                    shortlink: results[0].shortlink
                });
            });
        });
    });

    socket.on('delete:note', function(data) {
        note.validOwner(data.noteid, data.userid, function(results) {
            note.delete(data.noteid, function() {
                sockets.in(results[0].shortlink).emit('delete:note', {
                    noteid: results[0]._id
                });
            });
        });
    });



    // Section Stuff

    socket.on('get:sections', function(data) {
        section.getAll(data.noteid, function(results) {
            socket.emit('get:sections', results);
        });
    });

    socket.on('create:section', function(data) {
        section.create(data.noteid, data.userid, data.header, function(results) {
            sockets.in(data.shortlink).emit('create:section', results[0]);
        });
    });



    // Line Stuff

    socket.on('get:lines', function(data) {
        line.getAll(data.noteid, function(results) {
            socket.emit('get:lines', results);
        });
    });

    socket.on('create:line', function(data) {
        line.create(data.noteid, data.sectionid, data.userid, data.content, function(results) {
            sockets.in(data.shortlink).emit('create:line', results[0]);
        });
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
