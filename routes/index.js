const { Router } = require('express');
const router = Router();
const {
	newUser,
	getUser,
} = require('../controller/user.controller');
const { login } = require('../controller/login.controller');
const {
	newRoom,
	joinRoom,
	getRooms,
	getRoom,
} = require('../controller/room.controller');
const {
	newConversation,
	addToConversation,
} = require('../controller/conversations.controller');
const {
	newMessage,
	getMessages,
} = require('../controller/message.controller');

require('dotenv').config({ path: '../variables.env' });

module.exports = function () {
	// usuarios
	router.post('/user-register', newUser);
	router.get('/get-user/:token', getUser);
	// login
	router.post('/login', login);
	// salas
	router.post('/new-room', newRoom);
	router.put('/join-room', joinRoom);
	router.get('/get-rooms', getRooms);
	router.get('/get-room', getRoom);
	// conversaciones
	router.post('/new-conversation', newConversation);
	router.put('/add-to-conversation', addToConversation);
	// mensajes
	router.post('/new-message', newMessage);
	router.get('/get-messages', getMessages);
	return router;
};
