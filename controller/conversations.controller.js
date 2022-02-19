const Conversation = require('../model/conversations.model');
const Room = require('../model/room.model');
require('dotenv').config({ path: '../variables.env' });
const jwt = require('jsonwebtoken');

exports.newConversation = (req, res, next) => {
	const conversation = new Conversation(req.body);
	try {
		const token = req.body.token;
		if (!token) {
			res.json({
				status: 401,
				msg: 'Permiso denegado, necesita un token',
			});
			return;
		}
		jwt.verify(
			token,
			process.env.SECRET_WORD,
			async (error, data) => {
				if (error) {
					res.json({
						status: 401,
						msg: 'Error, fallo en la autenticación',
					});
					next();
				} else {
					/* Guardamos el id del que inicio la conversación */
					conversation.clients.push(
						data.id,
						req.body.idReceptor,
					);
					/* Obtenemos la sala donde se creo la conversación */
					const room = await Room.findOne({
						_id: req.body.idRoom,
					});
					/* si se desea guardar la conversación en la BD */
					if (!req.body.save) {
						res.json({
							status: 200,
							msg: 'Nueva conversación',
							note: 'Esta conversación no se guardara en la BD',
						});
						return;
					} else {
						/* agregamos la conversación a la sala */
						await Room.findOneAndUpdate(
							{ _id: req.body.idRoom },
							{
								chats: [...room.chats, conversation._id],
							},
						);
						/* guardamos la conversación */
						await conversation.save();
						res.json({
							status: 200,
							msg: 'Nueva conversación',
						});
					}
				}
			},
		);
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			msg: 'Hubo un problema en el servidor',
		});
		next();
	}
};

exports.addToConversation = async (req, res, next) => {
	try {
		const chat = await Conversation.findOne({
			_id: req.body.idChat,
		});
		await Conversation.findOneAndUpdate(
			{
				_id: chat._id,
			},
			{ clients: [...chat.clients, req.body.idNewClient] },
		);
		res.json({ status: 200, msg: 'Agregado' });
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			msg: 'Hubo un problema en el servidor',
		});
		next();
	}
};

exports.getConversations = async (req, res, next) => {
	try {
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			msg: 'Hubo un problema en el servidor',
		});
		next();
	}
};
