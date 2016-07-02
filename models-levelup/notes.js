var levelup = require('levelup');

var db = undefined;

exports.connect = function (location, callback) {
    db = levelup(location, {
        createIfMissing: true,
        valueEncoding: "json"
    }, callback);
};

exports.disconnect = function(callback) {
    db.close(callback);
};

exports.create = function (key, title, body, callback) {
    db.put(key, {title: title, body: body}, callback);
};

exports.update = exports.create;

exports.read = function (key, callback) {
    db.get(key, callback);
};

exports.destroy = function (key, callback) {
    db.del(key, callback);
};

exports.titles = function (callback) {
    var thenotes = [];
    db.createReadStream().on('data', function (data) {
        thenotes.push({key: data.key,
                       title: data.value.title});
    }).on('error', function (err) {
        callback(err);
    }).on('end', function () {
        callback(undefined, thenotes);
    });
};