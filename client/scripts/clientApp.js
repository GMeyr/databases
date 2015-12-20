 //TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
 //TODO remember to change id in the morning in client app   TODO
 //TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO





$(function(){

//setup environment
var app = {};
//friendsList hashmap
app.friendsList = {};
//hashmap of current html nodes
app.htmlNodes = {};
//maximum messages to display
app.maxMessagesDisplay = 20;
//current room
app.currentRoom = 'lobby';
//userName filled in later
app.userName = 'Bob Testuser';
//message area
app.messageArea = $('#main');
//userTextBox
app.userTextBox = $('#userTextBox');
//userSubmitText
app.userSubmitButton = $('#userSubmitButton');
//userChatRoomInput
app.userChatRoomInput = $('#userChatRoomInput');
//userChatRoomButton
app.userChatRoomButton = $('#userChatRoomButton');
//roomSelector
app.roomSelector = $('#roomSelector');



//HELPER FUNCTIONS:
//query function
app.queryMessages = function(queryData) {
  if(queryData === undefined){
    queryData = 'messages';
  }
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/' + queryData,
    type: 'GET',
    // data: queryData,
    contentType: 'application/json',
    success: function(data) {
      //create a tempResults array with a length set to our maxMessagesDisplay
      var tempResults = data.results.slice(0, app.maxMessagesDisplay);
      //process and sanitize our data before we update the browser
      tempResults = app.processData(tempResults);
      //update our messages
      app.updateMessages(tempResults);
      //update our rooms
      app.updateRooms(tempResults);
      console.log('chatterbox: data recieved. Data:', tempResults);
    },
    error: function(data) {
      console.log('failed to retrieve data', data);
    }
  });
};



//message function
app.createMessage = function(userText) {
  var message = {
    userName: this.userName,
    messageText: userText,
    roomName: this.currentRoom
  };
  //submit a new message
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent. Data: ', data);
      //run queryMessages to start the update process
      app.queryMessages();
    },
    error: function(data) {
      console.log('chatterbox: Failed to send message. Data: ', data);
    }
  });
};



//update function
app.updateMessages = function(resultsArray) {
  var toggleFriend = '';
  //new message nodes object to use as a hashmap
  var newMessageNodes = {};
  //map new nodes to object for fast comparison
  resultsArray.forEach(function(result) {
    newMessageNodes[result.id] = true;
  });
  //remove old nodes via hashmap comparison
  for (var key in this.htmlNodes) {
    if (key in newMessageNodes === false) {
      //delete the key from htmlNodes
      delete this.htmlNodes[key];
      //remove the corresponding dom node
      $('#' + key).remove();
    }
  }
  //update the dom
  for (var i = 0; i < resultsArray.length; i++) {
    toggleFriend = '';
    //check if we already have the item in our htmlNodes, if not do stuff with resultsArray
    if (resultsArray[i].id in this.htmlNodes === false) {
      //check if user is our friends
      if(resultsArray[i].userName in this.friendsList){
        toggleFriend = ' friends';
      }
      //build our node string
      var nodeString = '<div id="' + resultsArray[i].id + '" class="messageWrap"><div class="messageUser' + toggleFriend + '" data-userName="' + resultsArray[i].userName + '" ><span>' + resultsArray[i].userName + '</span></div><div class="messageText"><span>' + resultsArray[i].messageText + '<span></div></div>';
      //add our node string to the dom
      this.messageArea.append(nodeString);
      //add our new node to htmlNodes to prevent duplication
      this.htmlNodes[resultsArray[i].id] = true;
    }
  }
  //rebind click handlers
  this.setupFriendsClick();
};



app.updateRooms = function(resultsArray) {
    var optionString = "";
    //loop over resultsArray
    for (var i = 0; i < resultsArray.length; i++) {
      if (resultsArray[i].roomName !== undefined || resultsArray[i].roomName !== "") {
        //check if our room name is already a dom node in our select element
        if ($("#" + resultsArray[i].roomName).length === 0) {
          //add the room to our selector
          this.addRoomToSelector(resultsArray[i].roomName);
        }
      }
    }
};



//add a room to our selector
app.addRoomToSelector = function(roomName){
  //if our roomName does not exist create it
  if($(roomName).length === 0){
    //build the options string
    optionString = '<option id="' + roomName + '" value="' + roomName + '">' + roomName + '</option>';
    //add it to our select item
    this.roomSelector.append(optionString);
  }
};



//process and sanitize our data
app.processData = function(resultsArray){
  var i = 0;
  var keysToDelete = [];
  var isAlpha = /\W/g;
  var isAlphaOrWhiteSpace = /\W\s/g;
  var isBadInput = /<|>|\(|\)|\//g;
  //loop through our array
  for(i = 0; i < resultsArray.length; i++){
    //check id for non alphanumeric characters
    if(!('id' in resultsArray[i]) || !resultsArray[i].id || !(typeof resultsArray[i].id === 'number')){
      //save keys of non alphanumeric id's to get deleted later on
      keysToDelete.push(i);
      //skip the remaining checks because we're going to delete the object
      continue;
    }
    //check userName and replace
    if(!('userName' in resultsArray[i]) || !resultsArray[i].userName || resultsArray[i].userName === 'undefined' || resultsArray[i].userName.match(isAlphaOrWhiteSpace) !== null){
      //save bad data keys to delete later
      keysToDelete.push(i);
      //skip the remaining checks because this object will be deleted
      continue;
    }
    //replace white space
    resultsArray[i].userName = resultsArray[i].userName.replace(/\s/g,'-');

    //check roomName and replace
    if(!('roomName' in resultsArray[i])){
      resultsArray[i].roomName = 'lobby';
    }
    //remove bad data from roomName
    if(!resultsArray[i].roomName || resultsArray[i].roomName.match(isAlphaOrWhiteSpace) !== null){
      //save bad data keys to delete later
      keysToDelete.push(i);
      //skip the remaining checks because this object will be deleted
      continue;
    }
    //replace white space
    resultsArray[i].roomName = resultsArray[i].roomName.replace(/\s/g, '-');

    //check text and replace
    if(!('messageText' in resultsArray[i]) || !resultsArray[i].messageText || resultsArray[i].messageText.match(isBadInput) !== null){
      //save bad data keys to delete later
      keysToDelete.push(i);
      //skip the remaining checks because this object will be deleted
    }
  }

//delete bad objects from our results
  for(i = 0; i < keysToDelete.length; i++){
    resultsArray.splice(keysToDelete[i],1);
  }
  return resultsArray;
};


//function that sets up click handlers
app.setupFriendsClick = function(){
  //get all user names, remove old click handlers via off and add new click handlers
  $('.messageUser').off('click').on('click',function(){
    //pull user name from clicked friend
    var clickedMessageId = $(this).data('userName');
    //add friend to friendsList
    app.friendsList[clickedMessageId] = true;
    //add friend classes to dom nodes
    app.updateFriendsHTML(clickedMessageId);
    //re-run interval to set click handler
    app.interval();
  });
};



//function to update friend class on elements that already exist
app.updateFriendsHTML = function(friendName){
  var testElement;
  for(var key in this.htmlNodes){
    testElement = $('#' + key + ' .messageUser');
    if(testElement.data('userName') === friendName){
      testElement.addClass('friends');
    }
  }
};



//init function
app.init = function(){

  //CLICK handlers
  //user sends a message
  this.userSubmitButton.on('click',function(){
    //get the users message
    var userMessage = app.userTextBox.val();
    //if the user has a message run the update
    if(userMessage !== ''){
      //create the message
      app.createMessage(app.userTextBox.val());
      //reset the text box
      app.userTextBox.val('');
    }
  });
  //user adds a chat room
  this.userChatRoomButton.on('click', function(){
    //create the new room name and escape whitespace
    var newRoom = app.userChatRoomInput.val().replace(/\s/g, '-');
    //add the room to our selector
    app.addRoomToSelector(newRoom);
    //set the currentRoom name
    app.currentRoom = newRoom;
    //remove the text from chat room input
    app.userChatRoomInput.val('');
    //run interval to update everything including the select box
    app.interval();
  });
  //user selects a room
  this.roomSelector.on('change', function(){
    //set the current room to the new room selector
    app.currentRoom = app.roomSelector.val();
    //run interval to update everything
    app.interval();
  });

  //run our query update to gather chat rooms
  app.queryMessages('messages');
  //run our first interval to bind click events
  //app.interval();
  //run our interval based functions
  //setInterval(app.interval.bind(this),5000);
};



//function run at a set interval
app.interval = function(){
  app.queryMessages();
  //if the room selector isn't set to the current room, then set it to the current room
  if(this.roomSelector.val() !== this.currentRoom){
    this.roomSelector.val(this.currentRoom);
  }
};

//run init
app.init();
});
