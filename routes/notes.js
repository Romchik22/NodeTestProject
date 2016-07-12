/**
 * Created by sobolrr on 30.06.16.
 */
//var notes = require('../models/Notes');

var notes = undefined;
var readNote = function (key, user, res, cb) {
    notes.read(key, function (err, data) {
        if(err) {
            res.render('showerror', {
                title: "Could not read note " + key,
                user: user ? user : undefined,
                error: err
            });
            cb(err);
        }
        else if (!data) { 
            cb(new Error("No note found for " + key));
        } else {
            cb(null, data);
        }
    });
};
module.exports = {

    conf : function (params) {
        notes = params.model;
    },

    add: function (req, res, next) {
        var user = req.user ? req.user : undefined;
        res.render('noteedit', {
            title: "Add a Note",
            user: user,
            docreate: true,
            notekey: "",
            note: undefined
        });
    },

    save: function (req, res, next) {
        ((req.body.docreate === 'create')
            ? notes.create : notes.update
        )(req.body.notekey, req.body.title, req.body.body,
        function (err) {
            if(err) {
                res.render('showerror', {
                    title: "Could not update file",
                    error: err
                });
            } else {
                res.redirect('/noteview?key='+req.body.notekey);
            }
        });
    },

    view: function (req, res, next) {
        var user = req.user ? req.user : undefined;
        if(req.query && req.query.key) {
            readNote(req.query.key, user, res, function (err, data) {
                if (!err) {
                    res.render('noteview', {
                        title: data.title,
                        user: user, //req.user ? req.user : undefined,
                        notekey: req.query.key,
                        note: data
                    });
                }
                else {
                    res.render('showerror', {
                        title: "No note found for " + req.query.key,
                        user: user, //req.user ? req.user : undefined,
                        error: "Invalid key " + req.query.key
                    });
                }
            });
        } else {
            res.render('showerror', {
                title: "No key given for Note",
                user: user, //req.user ? req.user : undefined,
                error: "Must provide a Key to view a Note"
            });
        }
    },

    edit: function (req, res, next) {
        var user = req.user ? req.user : undefined;
        if(req.query.key){
            readNote(req.query.key, user, res, function (err, data) {
                if(!err) {
                    res.render('noteedit', {
                        title: data ? ("Edit " + data.title) : "Add a Note",
                        user: user,
                        docreate : false,
                        notekey: req.query.key,
                        note: data
                    });
                } else {
                    res.render('showerror', {
                        title: "No key given for Note",
                        user: user,
                        error: err
                    });
                }
            });
        }
    },

    destroy: function (req, res, next) {
        var user = req.user ? req.user : undefined;
        if(req.query.key){
            readNote(req.query.key, user, res, function(err, data) {
                if(!err) {
                    res.render('notedestroy', {
                        title: data.title,
                        user: user,
                        notekey: req.query.key,
                        note: data
                    });
                }
            });
        }
        else {
            res.render('showerror', {
                title: "No key given for Note",
                user: user,
                error: "Must provide a Key to view Node"
            });
        }
    },

    dodestroy: function (req, res, next) {
        notes.destroy(req.body.notekey, function(err) {
            if(err) {
                res.render("showerror", {
                    title: "Could not delete Note" + req.body.notekey,
                    error: err
                });
            } else {
                res.redirect('/');
            }
        });
    }

};
