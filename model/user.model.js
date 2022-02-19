const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		names: String,
		firstName: String,
		lastName: String,
	},
	nickname: String,
	password: String,
	movil: String,
	email: String,
	rooms: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('User', userSchema);
