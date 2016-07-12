/**
 * Created by sobolrr on 11.07.16.
 */
var assert = require('assert');
var vows = require('vows');
var async = require('async');
var seqConnectParams = require('../sequelize-params-test');

var model = undefined;
var setup = function (cb) {
    model = require('../models-sequelize/notes');
    model.connect(seqConnectParams, function (err) {
        var setup = require('./setup-model');
        setup.config(model, seqConnectParams, cb);
    });
};
setup(function (err) {
    vows.describe("models test")
        .addBatch({
            "check titles": {
                topic: function () { model.titles(this.callback); },
                "should have three entries": function (titles) {
                    assert.equal(titles.length, 3);
                },
                "should have keys n1 n2 n3": function(titles) {
                    titles.forEach(function(entry) {
                        assert.match(entry.key, /n[0-9]/);
                    });
                },
                "should have titles Node #": function(titles) {
                    titles.forEach(function(entry) {
                        assert.match(entry.title, /Note [0-9]/);
                    });
                }
                },
            "read note": {
                topic: function () {
                    model.read("n1", this.callback);
                },
                "should have proper note": function (note) {
                    assert.equal(note.title, "Note 1");
                    assert.equal(note.body, "Note 1");
                    assert.equal(note.notekey, "n1");
                    
                }
            },
            "change note": {
                topic: function () {
                    model.update("n1", "Note 1 title changed", "Note 1 body changed", this.callback);
                },
                        "after successful model.update": {
                            topic: function (err) {
                                model.read("n1", this.callback);
                            }, 
                         "should be changed": function (note) {
                             assert.equal(note.notekey, "n1");
                             assert.equal(note.title, "Note 1 title changed");
                             assert.equal(note.body, "Note 1 body changed");
                        }
                }
            }
        })
        .run();
});