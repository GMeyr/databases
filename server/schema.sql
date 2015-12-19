CREATE DATABASE chat
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

USE chat;

CREATE TABLE messages (
  messageId bigint NOT NULL AUTO_INCREMENT,
  messageText varchar(640),
  createdAt bigint,
  userName varchar(32),
  roomName varchar(32),
  -- FOREIGN KEY userName REFERENCES users(userName) ON DELETE CASCADE,
  -- FOREIGN KEY roomName REFERENCES rooms(roomName) ON DELETE CASCADE,
  PRIMARY KEY (messageId)
) ENGINE = INNODB;

CREATE TABLE users (
  userName varchar(32),
  PRIMARY KEY (userName)
) ENGINE = INNODB;

CREATE TABLE rooms (
  roomName varchar(32),
  PRIMARY KEY (roomName)
) ENGINE = INNODB;

CREATE TABLE friends (
  friend varchar(32),
  friendee varchar(32)
  -- FOREIGN KEY friend REFERENCES users(userName) ON DELETE CASCADE,
  -- FOREIGN KEY friendee REFERENCES users(userName) ON DELETE CASCADE
) ENGINE = INNODB;



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
