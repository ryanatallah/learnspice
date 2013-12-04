module.exports = function (cookieParser, sessionStore) {
  return function (data, accept) {
    if (data && data.headers && data.headers.cookie) {
      cookieParser(data, {}, function (err) {
        if (err) return accept('COOKIE_PARSE_ERROR');
        var sessionId = data.signedCookies['express.sid'];
        sessionStore.get(sessionId, function (err, session) {
          if (err || !session || !session.passport || !session.passport.user || !session.passport.user) {
            accept(null, true);
          } else {
            data.session = session;
            accept(null, true);
          }
        });
      });
    } else {
      return accept('MISSING_COOKIE', false);
    }
  };
};
