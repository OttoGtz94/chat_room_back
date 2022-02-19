const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../variables.env' });

exports.login = async (req, res, next) => {
	const nickname = req.body.nickname;
	const password = req.body.password;

	try {
		const user = await User.findOne({
			nickname,
		});
		/* Comparar contraseña */
		if (
			user === null ||
			!(await bcrypt.compare(password, user.password))
		) {
			res.json({
				status: 404,
				msg: 'Credenciales Incorrectas',
			});
			return;
		}
		const payload = {
			nombres: user.name,
			info: {
				nickname: user.nickname,
				movil: user.movil,
				email: user.email,
			},
			id: user._id,
		};

		const token = jwt.sign(payload, process.env.SECRET_WORD);

		res.json({
			status: 200,
			token,
			msg: 'Inicio de Sesión exitoso',
		});
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			msg: 'Hubo un problema en el servidor',
		});
	}
};
