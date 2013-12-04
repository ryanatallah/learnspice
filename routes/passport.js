var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('../config.js');
var User = require('../models/user.js');

module.exports = function (passport) {
  passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.key,
    clientSecret: config.auth.facebook.secret,
    callbackURL: 'http://' + config.web.domain + '/auth/facebook/callback'
  }, function (accessToken, refreshToken, profile, done) {
    var userdata = {
      id: profile.id,
      provider: 'facebook',
      name: profile.displayName
    };
    User.update(userdata, function (err, user) {
      done(null, user[0]);
    });
  }));
  passport.use(new GoogleStrategy({
    realm: 'http://' + config.web.domain + '/',
    returnURL: 'http://' + config.web.domain + '/auth/google/callback'
  }, function (id, profile, done) {
    var userdata = {
      id: id,
      provider: 'google',
      name: profile.displayName,
      email: profile.emails[0].value
    };
    User.update(userdata, function (err, user) {
      done(null, user[0]);
    });
  }));
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    User.find({_id: id}, function (err, user) {
      done(err, user[0]);
    });
  });
};
