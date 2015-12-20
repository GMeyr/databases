var db = require('../db');
var Promise = require('bluebird');

module.exports = {
  messages: {
    get: function() {

      return new Promise(function(resolve, reject) {
        db.conn.query('SELECT * FROM messages', function(error, results) {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });

    },
    post: function(messageText, userName, roomName) {
        // messageId,
        // messageText,
        // createdAt,
        // userName,
        // roomName,
        var createdAt = Date.now();

        db.conn.query('INSERT INTO messages (messageText, createdAt, userName, roomName) VALUES (?, ?, ?, ?)', [messageText, createdAt, userName, roomName]);

        //db.conn.query('INSERT INTO users (userName) VALUES (?)', [userName]);

        //db.conn.query('INSERT INTO rooms (roomName) VALUES (?)', [roomName]);

      } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function() {

      return new Promise(function(resolve, reject) {
        db.conn.query('SELECT * FROM users', function(error, results) {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });

    },
    post: function(userName) {
      var getUserName = new Promise(function(resolve, reject) {
        db.conn.query('SELECT * FROM users WHERE userName = ?', userName, function(error, results) {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });      

      getUserName.then(function(userNameArray){
        if(userNameArray.length === 0){
          db.conn.query('INSERT INTO USERS (userName) VALUES (?)', [userName]);
        }
      });

    }
  }
};











var getRoomNames = new Promise(function(resolve, reject) {
  db.conn.query('SELECT roomName FROM rooms', function(error, results) {
    if (error) {
      reject(error);
    }
    resolve(results);
  });
});
