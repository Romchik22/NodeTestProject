var users = require('./users');
users.connect(require('../sequelize-params'),
    function (err) {
        if (err) throw err;
    else {
           users.create(1, 'bob', '123', 'bob@gmail.com', function (err) {
               if (err) throw err;
                   else {
                   users.create(2, 'joe', '22', 'joe@rr.com', function (err) {
                       if (err) throw err;
                   });
               }
           });
        }
    });