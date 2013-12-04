var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('127.0.0.1/learnspice', ['notes']);

module.exports = {
  validOwner: function (noteid, userid, callback) {
    db.notes.find({
      _id: ObjectId(noteid),
      userid: userid
    }).toArray(function (err, results) {
        callback(results.length);
      });
  },
  get: function (shortlink, callback) {
    db.notes.find({'shortlink': shortlink}).toArray(function (err, results) {
      if (results.length) {
        callback(results);
      } else {
        callback(undefined);
      }
    });
  },
  create: function (title, userid, callback) {
    var shortlink = Math.random().toString(36).slice(2).substring(0, 4);
    var date_created = new Date();
    db.notes.insert({
        title: title,
        userid: userid,
        collaborators: [userid],
        shortlink: shortlink,
        date_created: date_created,
        date_updated: date_created,
        sections: {}
      },
      function (err, results) {
        callback(results);
      });
  },
  changeTitle: function (noteid, title, callback) {
    db.notes.update({_id: ObjectId(noteid)}, {$set: {title: title}}, function (err, results) {
      callback(results);
    });
  },
  section: {
    create: function (noteid, userid, header, callback) {
      var sectionid = ObjectId();
      var date_created = new Date();
      var section = {};
      section['sections.' + sectionid] = {
        _id: sectionid,
        noteid: noteid,
        userid: userid,
        editor: null,
        editors: [userid],
        header: header,
        date_created: date_created,
        date_updated: date_created,
        lines: {}
      };
      db.notes.update({_id: ObjectId(noteid)}, {$set: section}, function (err, results) {
        callback(section['sections.' + sectionid]);
      });
    },
    lock: function (sectionid, userid, callback) {
      var section = {}, section2 = {};
      section['sections.' + sectionid + '._id'] = ObjectId(sectionid);
      section['sections.' + sectionid + '.editor'] = null;
      section2['sections.' + sectionid + '._id'] = ObjectId(sectionid);
      section2['sections.' + sectionid + '.editor'] = userid;
      db.notes.update(section, {$set: section2}, function (err, results) {
        if (!err) {
          db.notes.find(section2).toArray(function (err, results) {
            callback(results[0].sections[sectionid]);
          });
        }
      });
    },
    unlock: function (sectionid, userid, callback) {
      var section = {}, section2 = {};
      section['sections.' + sectionid + '._id'] = ObjectId(sectionid);
      section['sections.' + sectionid + '.editor'] = userid;
      section2['sections.' + sectionid + '._id'] = ObjectId(sectionid);
      section2['sections.' + sectionid + '.editor'] = null;
      db.notes.update(section, {$set: section2}, function (err, results) {
        if (!err) {
          db.notes.find(section2).toArray(function (err, results) {
            callback(results[0].sections[sectionid]);
          });
        }
      });
    },
    changeHeader: function (sectionid, userid, header, callback) {
      var section = {}, section2 = {};
      section['sections.' + sectionid + '._id'] = ObjectId(sectionid);
      section['sections.' + sectionid + '.editor'] = userid;
      section2['sections.' + sectionid + '._id'] = ObjectId(sectionid);
      section2['sections.' + sectionid + '.header'] = header;
      db.notes.update(section, {$set: section2}, function (err, results) {
        if (!err) {
          db.notes.find(section2).toArray(function (err, results) {
            callback(results[0].sections[sectionid]);
          });
        }
      });
    },
    line: {
      create: function (noteid, sectionid, userid, content, callback) {
        var lineid = ObjectId();
        var date_created = new Date();
        var line = {};
        line['sections.' + sectionid + '.lines.' + lineid] = {
          _id: lineid,
          noteid: noteid,
          sectionid: sectionid,
          userid: userid,
          editor: null,
          editors: [userid],
          content: content,
          date_created: date_created,
          date_updated: date_created
        };
        db.notes.update({_id: ObjectId(noteid)}, {$set: line}, function (err, results) {
          callback(line['sections.' + sectionid + '.lines.' + lineid]);
        });
      },
      lock: function (sectionid, lineid, userid, callback) {
        var section = {}, section2 = {};
        section['sections.' + sectionid + '.lines.' + lineid + '._id'] = ObjectId(lineid);
        section['sections.' + sectionid + '.lines.' + lineid + '.editor'] = null;
        section2['sections.' + sectionid + '.lines.' + lineid + '._id'] = ObjectId(lineid);
        section2['sections.' + sectionid + '.lines.' + lineid + '.editor'] = userid;
        db.notes.update(section, {$set: section2}, function (err, results) {
          if (!err) {
            db.notes.find(section2).toArray(function (err, results) {
              callback(results[0].sections[sectionid].lines[lineid]);
            });
          }
        });
      },
      unlock: function (sectionid, lineid, userid, callback) {
        var section = {}, section2 = {};
        section['sections.' + sectionid + '.lines.' + lineid + '._id'] = ObjectId(lineid);
        section['sections.' + sectionid + '.lines.' + lineid + '.editor'] = userid;
        section2['sections.' + sectionid + '.lines.' + lineid + '._id'] = ObjectId(lineid);
        section2['sections.' + sectionid + '.lines.' + lineid + '.editor'] = null;
        db.notes.update(section, {$set: section2}, function (err, results) {
          if (!err) {
            db.notes.find(section2).toArray(function (err, results) {
              callback(results[0].sections[sectionid].lines[lineid]);
            });
          }
        });
      },
      changeContent: function (sectionid, lineid, userid, content, callback) {
        var section = {}, section2 = {};
        section['sections.' + sectionid + '.lines.' + lineid + '._id'] = ObjectId(lineid);
        section['sections.' + sectionid + '.lines.' + lineid + '.editor'] = userid;
        section2['sections.' + sectionid + '.lines.' + lineid + '._id'] = ObjectId(lineid);
        section2['sections.' + sectionid + '.lines.' + lineid + '.content'] = content;
        db.notes.update(section, {$set: section2}, function (err, results) {
          if (!err) {
            db.notes.find(section2).toArray(function (err, results) {
              callback(results[0].sections[sectionid].lines[lineid]);
            });
          }
        });
      }
    }
  }
};
