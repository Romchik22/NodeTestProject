/**
 * Created by sobolrr on 30.06.16.
 */
var notes = [];

module.exports = {
    update : function (key, title, body) {
    notes[key] = {title: title, body: body};
    },
    create : function (key, title, body) {
        notes[key] = {title: title, body: body};
    },
    read : function (key) {
        return notes[key];
    },
    destroy : function (key) {
        delete notes[key];
    },

    keys : function () {
        return Object.keys(notes);
        }
};
