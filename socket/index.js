var User = require('../models/user.js');
var note = require('../models/note.js');
var message = require('../models/message.js');

var noteid;

module.exports = function (sockets) {
  return function (socket) {
    if (socket.handshake.session) {
      var _id = socket.handshake.session.passport.user;
      User.find({_id: _id}, function (err, result) {
        var user = result[0];
        if (user) {
          var publicProfile = {
            _id: user._id,
            id: user.id,
            provider: user.provider,
            name: user.name,
            socketid: socket.id,
            online: true
          };
          User.update(publicProfile, function (err, result) {
            socket.emit('self', user);
          });
          socket.on('disconnect', function (data) {
            publicProfile.socketid = null;
            publicProfile.online = false;
            User.update(publicProfile, function (err, result) {
              if (noteid) {
                socket.broadcast.to(noteid).emit('user:offline', publicProfile);
                socket.leave(noteid);
              }
            });
          });
          socket.on('self', function (data) {
            socket.emit('self', user);
          });
          socket.on('get:note', function (data) {
            if (noteid) {
              socket.broadcast.to(noteid).emit('user:offline', publicProfile);
              socket.leave(noteid);
            }
            note.get(data.shortlink, function (results) {
              if (results) {
                noteid = results[0]._id + '';
                socket.emit('get:note', results[0]);
                socket.join(noteid);
                socket.broadcast.to(noteid).emit('user:online', publicProfile);
              } else {
                socket.emit('get:note');
              }
            });
          });
          socket.on('create:note', function (data) {
            note.create(data.title, user._id, function (results) {
              if (results.length) {
                socket.emit('create:note', {
                  noteid: results[0]._id,
                  title: results[0].title,
                  shortlink: results[0].shortlink
                });
              } else {
                socket.emit('create:note');
              }
            });
          });
          socket.on('create:section', function (data) {
            note.section.create(noteid, user._id, data.header, function (results) {
              sockets.in(noteid).emit('update:section', results);
            });
          });
          socket.on('lock:section', function (data) {
            note.section.lock(data.sectionid, user._id, function (results) {
              socket.broadcast.to(noteid).emit('update:section', results);
            });
          });
          socket.on('unlock:section', function (data) {
            note.section.unlock(data.sectionid, user._id, function (results) {
              sockets.in(noteid).emit('update:section', results);
            });
          });
          socket.on('update:section', function (data) {
            note.section.changeHeader(data.sectionid, user._id, data.header, function (results) {
              socket.broadcast.to(noteid).emit('update:section', results);
            });
          });
          socket.on('create:line', function (data) {
            note.section.line.create(noteid, data.sectionid, user._id, data.content, function (results) {
              sockets.in(noteid).emit('update:line', results);
            });
          });
          socket.on('create:message', function (data) {
            message.create(noteid, user._id, data.contents, function (results) {
              sockets.in(noteid).emit('update:message', results[0]);
            });
          });
          socket.on('lock:line', function (data) {
            note.section.line.lock(data.sectionid, data.lineid, user._id, function (results) {
              socket.broadcast.to(noteid).emit('update:line', results);
            });
          });
          socket.on('unlock:line', function (data) {
            note.section.line.unlock(data.sectionid, data.lineid, user._id, function (results) {
              sockets.in(noteid).emit('update:line', results);
            });
          });
          socket.on('update:line', function (data) {
            note.section.line.changeContent(data.sectionid, data.lineid, user._id, data.content, function (results) {
              socket.broadcast.to(noteid).emit('update:line', results);
            });
          });
        }
      });
    } else {
      socket.on('get:note', function (data) {
        if (noteid) {
          socket.leave(noteid);
        }
        note.get(data.shortlink, function (results) {
          if (results) {
            noteid = results[0]._id + '';
            socket.emit('get:note', results[0]);
            socket.join(noteid);
          } else {
            socket.emit('get:note');
          }
        });
      });
      socket.emit('self', {});
    }
    socket.on('get:messages', function (data) {
      message.getAll(noteid, function (results) {
        socket.emit('send:messages', results);
      });
    });
  };
};
