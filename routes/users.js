/**
 * Created by sobolrr on 04.07.16.
 */
var LocalStrategy = require('passport-local').Strategy;

var users = undefined;
var passport = undefined;

module.exports = {
    conf : function (params) {
        users = params.users;
        passport = params.passport;
    },

    serialize: function (user, done) {
        done(null, user.id);
    },
    
    deserialize: function (id, done) {
        users.findById(id, function (err, user) {
            done(err, user);
        });
    },
    
    strategy: new LocalStrategy(function (username, password, done) {
        process.nextTick(function () {
            users.findByUsername(username, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, {
                    message: 'Unknown user ' + username
                }); }
                if (user.password != password) {
                    return done(null, false, {
                        message: 'Invalid password'}); }
                return done(null, user);
            });
        });
    }),

    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) { return next();}
        return res.redirect('/login');
    },

    doAccount: function (req, res) {
        res.render('account', {
            title: 'Account information for ' + req.user.username,
            user: req.user
        })
    },

    doLogin: function (req, res) {
        res.render('login', {
            title: 'Login to Notes',
            user: req.user,
            message: req.flash('err')
        });
    },

    postLogin: function (req, res) {
        res.redirect('/');
    },
    
    doLogout: function (req, res) {
        req.logout();
        res.redirect('/');
    }
    
    
};
