module.exports.index = function (req, res) {
  res.render('index');
};

module.exports.logout = function (req, res) {
  req.logout();
  res.send(200);
}

module.exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
