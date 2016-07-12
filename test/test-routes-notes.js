/**
 * Created by sobolrr on 11.07.16.
 */
var assert = require("assert")
var vows  = require('vows');
var model = require('./mock-model');
var notes = require("../routes/notes");
notes.conf({ model: model });
var setup = require('./setup-model');
setup.config(model, { }, function() { });

var mockRes = function(vows) {
    return {
        render: function() { vows.callback('render', arguments); },
        redirect: function() { vows.callback('redirect', arguments); }
    };
};
var mockNext = function(vows) {
    return function() { vows.callback('next', arguments); };
};

vows.describe("notes routes")
    .addBatch({
        "view with bad key": {
            topic: function() {
                notes.view({
                    query: { key: "a key" },
                    user: "a user"
                }, mockRes(this), mockNext(this));
            },
            "should error on no key": function(command, args) {
                assert.match(command, /render/);
                assert.match(args[0], /showerror/);
                assert.match(args[1].title, /No note found for/);
            }
        },
        "view no key": {
            topic: function() {
                notes.view({
                    query: undefined,
                    user: "a user"
                }, mockRes(this), mockNext(this));
            }, "should error on no key": function(command, args) {
                assert.match(command, /render/);
                assert.match(args[0], /showerror/);
                assert.match(args[1].title, /No key given for/);
            }
        },
        "view correct key": {
            topic: function() {
                notes.view({
                    query: { key: "n1" },
                    user: "a user"
                }, mockRes(this), mockNext(this));
            },
            "should render no error": function(command, args) {
                assert.match(command, /render/);
                assert.match(args[0], /noteview/);
                assert.equal(args[1].notekey, "n1");
            }
        }
    })
    .addBatch({
        "save": {
            topic: function() {
                notes.save({
                    body: {
                        docreate: 'create',
                        notekey: "new",
                        title: "New Note",
                        body: "Body of new note"
                    },
                    user: "a user"
                }, mockRes(this), mockNext(this));
            },
            "should redirect": function(command, args) {
                assert.equal(command, "redirect");
                assert.match(args[0], /noteview/);
            }
        }
    }).run();