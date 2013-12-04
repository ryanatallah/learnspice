var config = require('./config.js');
var routes = require('./routes');
var express = require('express');
var passport = require('passport');
var cookieParser = express.cookieParser(config.web.secret);
var sessionStore = new express.session.MemoryStore();

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });

app.set('port', config.web.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cookieParser);
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ store: sessionStore, secret: config.web.secret, key: 'express.sid' }));
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

require('./routes/passport.js')(passport);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/' }));
app.post('/logout', routes.logout);
app.get('/partials/:name', routes.partials);
app.get('*', routes.index);

io.set('authorization', require('./socket/passport.js')(cookieParser, sessionStore));

io.sockets.on('connection', require('./socket')(io.sockets));

server.listen(app.get('port'), function () {
  console.log('LearnSpice server listening on port ' + app.get('port'));
});
