var express = require('express');
var config = require('./config.js');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var passport = require('passport');
var cookieParser = express.cookieParser('secret');
var sessionStore = new express.session.MemoryStore();

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });

app.set('port', config.web.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//app.use(express.logger('dev'));
app.use(cookieParser);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ store: sessionStore, secret: 'secret', key: 'express.sid' }));
app.use(express.methodOverride());
app.use(express.errorHandler());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

require('./routes/auth.js')(passport);

app.get('/', routes.index);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/' }));
app.post('/logout', routes.logout);
app.get('/partials/:name', routes.partials);
app.get('*', routes.index);

io.set('authorization', require('passport.socket.io')(cookieParser, sessionStore, 'express.sid'));

io.sockets.on('connection', function(socket) {
    require('./routes/socket.js')(io.sockets, socket)
});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});