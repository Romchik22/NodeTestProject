var events = require('events');
var emitter = module.exports.emitter = new events.EventEmitter();
var notes = [];
exports.connect = function(params, callback) {
    callback();
};
exports.disconnect = function(callback) {
    callback();
};
exports.update = exports.create = function(key, title, body, callback)
{
    notes[key] = { title: title, body: body };
    exports.emitter.emit('noteupdated', {
        key: key, title: title, body: body
    });
    callback();
};
exports.read = function(key, callback) {
    callback(undefined, notes[key]);
};
exports.destroy = function(key, callback) {
    delete notes[key];
    emitter.emit('notedeleted', key);
    callback();
};
exports.titles = function(callback) {
    var thenotes = [];
    Object.keys(notes).forEach(function (note) {
        thenotes.push({ key: note.notekey, title: note.title });
    });
    callback(null, thenotes);
};