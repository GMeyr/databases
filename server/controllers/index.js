var models = require('../models');
var bluebird = require('bluebird');


module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get().then(function(messageData){
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // res.header("Access-Control-Max-Age", 10);
        // res.header("Content-Type", "application/json");
        res.json({results:messageData});
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body.messageText, req.body.userName, req.body.roomName);
      res.sendStatus(201);
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get().then(function(userData){
        res.json({results: userData});
      });
    },
    post: function (req, res) {
      models.users.post(req.body.userName);
      res.sendStatus(201);
    }
  }
};

