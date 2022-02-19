const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './variables.env' });
const conexionDB = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(cors());

const PORT = process.env.PORT;

mongoose.Promise = global.Promise;

conexionDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes());

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
