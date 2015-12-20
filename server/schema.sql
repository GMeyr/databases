DROP DATABASE chat;

CREATE DATABASE chat
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

USE chat;

CREATE TABLE messages (
  id bigint NOT NULL AUTO_INCREMENT,
  messageText varchar(640),
  userName varchar(32),
  roomName varchar(32),
  -- FOREIGN KEY userName REFERENCES users(userName) ON DELETE CASCADE,
  -- FOREIGN KEY roomName REFERENCES rooms(roomName) ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE users (
  userName varchar(32),
  PRIMARY KEY (userName)
) ENGINE = INNODB;

CREATE TABLE rooms (
  roomName varchar(32),
  PRIMARY KEY (roomName)
) ENGINE = INNODB;


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
