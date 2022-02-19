const Room = require('../model/room.model');
const Conversation = require('../model/conversations.model');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const { generateCode } = require('../helpers/');
const {
	newConversation,
} = require('./conversations.controller');
require('dotenv').config({ path: '../variables.env' });

exports.newRoom = async (req, res, next) => {
	const room = new Room(req.body);

	try {
		/* Comprobar token */
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
					/* Comprobar si el nombre ya existe */
					const nameRoomExists = await Room.findOne({
						name: room.name,
					});
					if (nameRoomExists !== null) {
						res.json({
							status: 400,
							msg: `Ya existe una sala con el nombre "${room.name}"`,
						});
						return;
					}
					/* Agregamos desde el token al administrador */
					room.admin = data.id;
					/* Asignar codigo de referencia de sala */
					room.reference_code = generateCode();
					/* Agregamos el administrador como cliente  */
					room.clients.push(data.id);
					/* Agregamos la sala al usuario */
					const user = await User.findOne({ _id: data.id });
					await User.findOneAndUpdate(
						{ _id: data.id },
						{ rooms: [...user.rooms, room._id] },
					);
					await room.save();
					res.json({
						status: 200,
						msg: 'Sala creada',
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

/* Unirte a una sala */
exports.joinRoom = async (req, res, next) => {
	const code = req.body.code;
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
				} else {
					const room = await Room.findOne({
						reference_code: code,
					});
					/* Guardar id cliente en arreglo de sala */
					await Room.findOneAndUpdate(
						{ reference_code: room.reference_code },
						{
							clients: [...room.clients, data.id],
						},
						{ new: true },
					);
					/* Agregamos la sala al usuario */
					const user = await User.findOne({ _id: data.id });
					await User.findOneAndUpdate(
						{ _id: data.id },
						{ rooms: [...user.rooms, room._id] },
					);
					res.json({
						status: 200,
						msg: `Te uniste a la sala ${room.name}`,
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

exports.getRooms = (req, res, next) => {
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
					const user = await User.findOne({ _id: data.id });
					const rooms = await Room.find({
						_id: user.rooms.map(room => room),
					});
					res.json({ rooms });
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

exports.getRoom = (req, res, next) => {
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
					//const user = await User.findOne({ _id: data.id });
					const room = await Room.findOne({
						_id: req.body.room,
					});
					if (room.clients.includes(data.id)) {
						res.json({ status: 200, room });
					} else {
						res.json({
							status: 400,
							msg: 'No existe esa sala',
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
