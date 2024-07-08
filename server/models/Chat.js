import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		messages: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Message',
				default: [],
			},
		],
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;