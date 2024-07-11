import { Chat, Message, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

const resolvers = {
	Query: {
		users: async () => {
			return User.find();
		},
		user: async (_parent, { userId }) => {
			return User.findById(userId);
		},
		me: async (_parent, _args, context) => {
			if (context.user) {
				return User.findById(context.user._id);
			}
		},
		messages: async (_parent, { receiverId, senderId }, context) => {
			// if no senderId retrieve from context
			if (!senderId) {
				senderId = context.user._id;
			}

			// try find chat with sender and receiver as participants
			const chat = await Chat.findOne({
				participants: {
					$all: [senderId, receiverId],
				},
			}).populate('messages');


			// if no chat found return empty array
			if (!chat) {
				return [];
			}

			// otherwise return chat's messages array
			return chat.messages;
		},
	},

	Mutation: {
		addUser: async (_parent, { username, email, password, avatar }) => {
			// create avatar url
			const avatarUrl = `https://robohash.org/${username}?set=set${avatar}`;

			const newUser = User.create({
				username,
				email,
				password,
				avatar: avatarUrl,
			});

			const token = signToken(newUser);

			return { token, newUser };
		},
		login: async (_parent, { username, password }, _context) => {
			const user = await User.findOne({ username });

			if (!user) {
				throw new GraphQLError('Incorrect username or password');
			}

			console.log(user);

			const correctPassword = await user.isCorrectPassword(password);

			if (!correctPassword) {
				throw new GraphQLError('Incorrect username or password');
			}

			// generate token for authenticated user
			const token = signToken(user);
			return { token, user };
		},
		sendMessage: async (
			_parent,
			{ receiverId, content, senderId },
			context
		) => {
			// if no senderId get from context
			if (!senderId) {
				senderId = context.user._id;
			}

			// try find Chat with sender and receiver as participants
			let chat = await Chat.findOne({
				participants: {
					$all: [senderId, receiverId],
				},
			});

			// if chat doesn't exist create one
			if (!chat) {
				chat = await Chat.create({
					participants: [senderId, receiverId],
				});
			}

			// create message
			const newMessage = new Message({
				senderId,
				receiverId,
				content,
			});

			// if message created successfully push onto chat's messages array
			if (newMessage) {
				chat.messages.push(newMessage._id);
			}

			// save updated/new documents to db in parallel
			await Promise.all([chat.save(), newMessage.save()]);

			// socket.io functionality goes here

			console.log('chat', chat);
			console.log('newMessage', newMessage);

			return newMessage;
		},
	},
};

export default resolvers;
