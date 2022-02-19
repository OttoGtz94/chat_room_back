const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../variables.env' });

exports.newUser = async (req, res, next) => {
	const user = new User(req.body);

	try {
		/* Comprobar si ya existe nickname y/o correo */
		const mailExists = await User.findOne({
			email: user.email,
		});
		const nickNameExists = await User.findOne({
			nickname: user.nickname,
		});
		if (mailExists !== null || nickNameExists) {
			res.json({
				status: 400,
				msg: `${user.email}/${user.nickname} ya esta registrado, inicia Sesión`,
			});
			return;
		}
		/* Comprobar contraseña */
		if (
			user.password.length < 8 ||
			user.password.length > 16
		) {
			res.json({
				status: 400,
				msg: 'La contraseña debe de tener de 8 a 16 caracteres',
			});
			return;
		} else if (
			user.password === '12345678' ||
			user.password === 'contraseña'
		) {
			res.json({
				status: 400,
				msg: 'Contraseña muy insegura',
			});
			return;
		}
		/* Encriptar contraseña */
		user.password = await bcrypt.hashSync(user.password);

		/* Guardar */
		await user.save();
		res.json({
			status: 200,
			msg: 'Usuario registrado',
		});
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			msg: 'No se pudo registrar el usuario',
		});
		next();
	}
};

exports.getUser = (req, res, next) => {
	try {
		//const token = req.body.token;
		console.log(req);
		/* if (!token) {
			res.json({
				status: 401,
				msg: 'Permiso denegado, necesita un token',
			});
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
					const user = await User.findOne({ _id: data.id });
					res.json({
						status: 200,
						msg: 'Usuario autenticado',
						user,
					});
				}
			},
		); */
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			msg: 'Error en el servido',
		});
	}
};
