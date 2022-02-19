const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationsSchema = new Schema({
	messages: [Schema.Types.ObjectId],
	clients: [Schema.Types.ObjectId],
	private: Boolean,
});

module.exports = mongoose.model(
	'Conversations',
	conversationsSchema,
);
