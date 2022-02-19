const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date = new Date();
const currentDate = `${date.getDate()}-${
	date.getMonth() + 1
}-${date.getFullYear()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const messageSchema = new Schema({
	date: {
		/* type: String,
		default: currentDate, */
		type: Date,
		default: Date.now,
	},
	sender: Schema.Types.ObjectId,
	message: String,
	conversation: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Message', messageSchema);
