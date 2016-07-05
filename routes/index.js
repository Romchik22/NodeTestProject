//var notes = require('../models/Notes');

var notes = undefined;


  exports.conf = function(params) {
    notes = params.model;
  };

  exports.index = function (req, res, next) {
    notes.titles(function (err, titles) {
      if(err) {
        res.render('showerror', {
          title: "Could not retrieve note keys from data store",
          user: req.user ? req.user : undefined,
          error: err
        });
      } else {
        res.render('index', {
          title: 'Notes',
          user: req.user ? req.user : undefined,
          notes: titles});
      }
    });
  };

