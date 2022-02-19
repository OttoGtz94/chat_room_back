const Message = require('../model/message.model');
const Conversation = require('../model/conversations.model');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');

exports.newMessage = (req, res, next) => {
	const message = new Message(req.body);
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
					/* buscar la conversacion */
					const idConversation = req.body.conversation;
					const conversation = await Conversation.findOne({
						_id: idConversation,
					});

					message.sender = data.id;
					await Conversation.findOneAndUpdate(
						{ _id: idConversation },
						{
							messages: [
								...conversation.messages,
								message._id,
							],
						},
						{ new: true },
					);
					await message.save();
					res.json({
						status: 200,
						msg: 'Mensaje enviado',
					});
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

exports.getMessages = async (req, res, next) => {
	try {
		//const chat = await Conversation.find({_id: req.body.chat});

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
					//const user = await User.findOne({ _id: data.id });
					const chat = await Conversation.findOne({
						_id: req.body.chat,
					});
					if (chat.clients.includes(data.id)) {
						const messages = await Message.find({
							conversation: req.body.chat,
						});
						res.json({ status: 200, messages });
					} else {
						res.json({
							status: 400,
							msg: 'Error, no estas en la conversación',
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
