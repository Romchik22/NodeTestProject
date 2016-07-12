/**
 * Created by sobolrr on 11.07.16.
 */
var async = require('async');
exports.config = function(model, params, cb) {
    async.series([
        function(done) {
            model.connect(params, done);
        },
        function(done) {
            var delFirst = function() {
                model.titles(function(err, notes) {
                    if (err) done(err);
                    else {
                        if (notes.length >= 1) {
                            model.destroy(notes[0].key,
                                function(err) {
                                    if (err) done(err);
                                    else delFirst();
                                });
                        } else done();
                    }
                });
            };
            delFirst();
        },
        function(done) {
            model.create("n1", "Note 1", "Note 1", done);
        },
        function(done) {
            model.create("n2", "Note 2", "Note 2", done);
        },
        function(done) {
            model.create("n3", "Note 3", "Note 3", done);
        }],
        function(err) {
            if (err) throw err;
            else {
                model.disconnect(function() { });
                cb();
            }
        });
}