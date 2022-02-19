const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
	name: String,
	chats: [Schema.Types.ObjectId],
	admin: Schema.Types.ObjectId,
	clients: [Schema.Types.ObjectId],
	reference_code: String,
	description: String,
});

module.exports = mongoose.model('Room', roomSchema);
