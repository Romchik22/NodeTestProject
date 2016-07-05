var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var notes = require('./routes/notes');
var users = require('./routes/users');
var seqConnectParams = require('./sequelize-params');


// var model = require('./models-fs/notes');
// model.connect("./Notes", function (err) {
//   if(err) {
//     throw err;
//   }
// });
// [routes, notes].forEach(function (router) {
//   router.conf({ model: model});
// });

//LevelDb model
// var modelLevelUp = require('./models-levelup/notes');
// modelLevelUp.connect('./chap6', function (err) {
//   if(err) {
//     throw err;
//   }
// });
// [routes, notes].forEach(function (router) {
//   router.conf({model:modelLevelUp});
// });

// sqlite3 model
// var modelSqlite = require('./models-sqlite3/notes');
// modelSqlite.connect('./chap06.sqlite3', function (err) {
//   if(err) throw err;
// });
// [routes, notes].forEach(function (router) {
//   router.conf({model: modelSqlite});
// });

// sequelize model // you can add information about your db
var notesModel = require('./models-sequelize/notes');
notesModel.connect(seqConnectParams,
function (err) {
  if (err) throw err;
});
[routes, notes ].forEach(function (router) {
  router.conf({ model: notesModel});
});

// //Mongo model
// var modelMongo = require('./models-mongoose/notes'); // you must install mongoDb and create db "chap6"
// modelMongo.connect("mongodb://localhost/chap06");
// [routes, notes].forEach(function (router) {
//   router.conf({model: modelMongo});
// });

var usersModel = require('./models-sequelize/users');
usersModel.connect(seqConnectParams,
    function (err) {
      if(err) throw err;
    });
users.conf({
  users: usersModel,
  passport: passport
    });

passport.serializeUser(users.serialize);
passport.deserializeUser(users.deserialize);
passport.use(users.strategy);

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // 1
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({secret: 'Node.js'})); // 2
app.use(flash());
app.use(passport.initialize()); // 3
app.use(passport.session()); // 4


app.get('/', routes.index);
app.get('/noteadd', users.ensureAuthenticated, notes.add);
app.post('/notesave', users.ensureAuthenticated, notes.save);
app.get('/noteview', notes.view);
app.get('/noteedit', users.ensureAuthenticated, notes.edit);
app.get('/notedestroy', users.ensureAuthenticated, notes.destroy);
app.post('/notedodestroy', users.ensureAuthenticated, notes.dodestroy);
app.get('/account', users.ensureAuthenticated, users.doAccount);
app.get('/login', users.doLogin);
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login', failureFlash:true}), users.postLogin);
app.get('/logout', users.doLogout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
