/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request"); // You might need to npm install the request module!
var expect = require('../../node_modules/chai/chai').expect;

describe("Persistent Node Chat Server", function() {
  this.timeout(5000);
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: "root",
      password: "",
      database: "chat"
    });
    dbConnection.connect();

    var tablename = "messages";

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("truncate " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
    // Post the user to the chat server.
    request({
      method: "POST",
      uri: "http://127.0.0.1:3000/classes/users",
      json: {
        userName: "Valjean"
      }
    }, function() {
      // Post a message to the node chat server:
      request({
        method: "POST",
        uri: "http://127.0.0.1:3000/classes/messages",
        json: {
          userName: "Valjean",
          messageText: "In mercy's name, three days is all I need.",
          roomName: "Hello"
        }
      }, function() {

        var queryString = 'SELECT * FROM messages WHERE userName = "Valjean"';

        dbConnection.query(queryString, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);
          expect(results[0].messageText).to.equal("In mercy's name, three days is all I need.");

          done();
        });
      });
    });
  });

  it("Should output all messages from the DB", function(done) {
    this.timeout(5000);

    var queryString = "INSERT INTO messages (messageText, userName, roomName) VALUES (?, ?, ?, ?)";

    dbConnection.query(queryString, [ "Men like you can never change!", "Trumbo", "main" ], function(err) {
      if (err) {
        throw err;
      }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request("http://127.0.0.1:3000/classes/messages", function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog.results[0].messageText).to.equal("Men like you can never change!");
        expect(messageLog.results[0].roomName).to.equal("main");
        done();
      });
    });
  });
});
