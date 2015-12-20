var db = require('../db');
//var Promise = require('bluebird');
var SQ = require("sequelize");
var sq = new SQ("chat", "root", "");

var messages = sq.define("messages", {
  messageText : SQ.STRING,
  userName : SQ.STRING,
  roomName : SQ.STRING
});

var users = sq.define('users',{userName: SQ.STRING});
var rooms = sq.define('rooms',{roomName: SQ.STRING});

messages.sync();
users.sync();
rooms.sync();


module.exports = {
  messages: {
    get: function() {

      return messages.findAll();

      // return new Promise(function(resolve, reject) {
      //   db.conn.query('SELECT * FROM messages', function(error, results) {
      //     if (error) {
      //       reject(error);
      //     }
      //     resolve(results);
      //   });
      // });

    },
    post: function(messageText, userName, roomName) {

      return  messages.create({
            messageText: messageText,
            userName: userName,
            roomName: roomName
          });

        // db.conn.query('INSERT INTO messages (messageText, userName, roomName) VALUES (?, ?, ?)', [messageText, userName, roomName]);
        //
        // db.conn.query('INSERT IGNORE INTO users (userName) VALUES (?)', [userName]);
        //
        // db.conn.query('INSERT IGNORE INTO rooms (roomName) VALUES (?)', [roomName]);

      } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function() {

      return users.findAll();

      // return new Promise(function(resolve, reject) {
      //   db.conn.query('SELECT * FROM users', function(error, results) {
      //     if (error) {
      //       reject(error);
      //     }
      //     resolve(results);
      //   });
      // });



    },
    post: function(userName) {

      return users.create({userName: userName});

      // var getUserName = new Promise(function(resolve, reject) {
      //   db.conn.query('SELECT * FROM users WHERE userName = ?', userName, function(error, results) {
      //     if (error) {
      //       reject(error);
      //     }
      //     resolve(results);
      //   });
      // });

      // getUserName.then(function(userNameArray){
      //   if(userNameArray.length === 0){
      //     db.conn.query('INSERT INTO users (userName) VALUES (?)', [userName]);
      //   }
      // });
      //db.conn.query('INSERT IGNORE INTO users (userName) VALUES (?)', [userName]);


    }
  }
};
