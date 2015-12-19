var db = require('../db');
var Promise = require('bluebird');

module.exports = {
  messages: {
    get: function () {

      return new Promise(function(resolve, reject) {
        db.conn.query('select * from messages', function(error, results, fields){
          if(error){
            reject(error);
          }
          resolve(results);
        });
      });

    },
    post: function () {

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {
      db.conn.query('select * from users', function(errors, results, fields){
        return JSON.stringify(results);
      })
    },
    post: function () {}
  }
};
