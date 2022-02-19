const mongoose = require('mongoose');
require('dotenv').config({ path: '../variables.env' });

const conexionDB = async () => {
	try {
		await mongoose.connect(process.env.DB_MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (error) {
		console.log('No se pudo conectar a la BD', { error });
	}
};

module.exports = conexionDB;
