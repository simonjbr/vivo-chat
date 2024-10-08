import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
	{
		participantOne: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		participantTwo: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		lastSeenByOne: {
			type: Date,
			default: 0,
		},
		lastSeenByTwo: {
			type: Date,
			default: 0,
		},
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
		toJSON: {
			virtuals: true,
		},
	}
);

// virtual to produce an array made up of the two participants
chatSchema.virtual('participants').get(function () {
	return [this.participantOne, this.participantTwo];
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
