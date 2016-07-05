var Sequelize = require("sequelize");
var Note = undefined;

module.exports = {
    connect: function (params, callback) {
        var sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);
        Note = sequlz.define('Note', {
            notekey: {
                type: Sequelize.STRING,
                primarykey: true, unique: true
            },
            title: Sequelize.STRING,
            body: Sequelize.TEXT
        });
        Note.sync().then(function () {  //success or then function
            callback();
        }).error(function (err) {
            callback(err);
        });
    },

    disconnect: function (callback) {
        callback();
    },

    create: function (key, title,body, callback) {
        Note.create({
            notekey: key,
            title: title,
            body: body
        }).then(function (note) {
            callback();
        }).error(function (err) {
            callback(err)
        });
    },

    update: function (key, title, body, callback) {
        Note.find({ where:{ notekey: key} }).then(function (note) {
            if(!note) {
                callback(new Error("No note found for key " + key));
            } else {
                note.updateAttributes({
                    title: title,
                    body: body
                }).then(function () {
                    callback();
                }).error(function (err) {
                    callback(err);
                });
            }
        });
    },

    read: function (key, callback) {
        Note.find({where:{ notekey: key} }).then(function (note) {
            if(!note) {
                callback("Nothing found for " + key);
            } else {
                callback(null, {
                    notekey: note.notekey,
                    title: note.title,
                    body: note.body
                });
            }
        });
    },
    
    destroy: function (key, callback) {
        Note.find({where:{notekey: key} }).then(function (note) {
            note.destroy().then(function () {
                callback();
            }).error(function (err) {
                callback(err);
            });
        });
    },
    
    titles: function (callback) {
        Note.findAll().then(function(notes) {
            var thenotes = [];
            notes.forEach(function (note) {
                thenotes.push({
                    key: note.notekey, title: note.title
                });
            });
            callback(null, thenotes);
        });
    }
    
};