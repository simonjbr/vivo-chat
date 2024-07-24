import { Chat, Message, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

import { PubSub } from 'graphql-subscriptions';

// create a PubSub instance to publish and listen for events
const pubsub = new PubSub();

const resolvers = {
	Query: {
		users: async (_parent, _args, context) => {
			return await User.find();
		},
		user: async (_parent, { userId }) => {
			return await User.findById(userId);
		},
		me: async (_parent, _args, context) => {
			if (context.user) {
				return await User.findById(context.user._id);
			}
		},
		messages: async (_parent, { receiverId, senderId }, context) => {
			// cookie found:
			// context.headers.cookie;
			// verified userdata found:
			// context.user.<_id|username>

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
		chats: async (_parent, _args, context) => {
			const chats = await Chat.find({
				// participants: {
				// 	$in: context.user._id,
				// },
			}).populate('participants');

			if (!chats) {
				throw new GraphQLError('Could not find any chats');
			}

			console.log(chats);

			return chats;
		},
		chat: async (_parent, { participantOne, participantTwo }, _context) => {
			const chat = await Chat.findOne({
				participants: {
					$all: [participantOne, participantTwo],
				},
			})
				.populate('participants')
				.populate('messages');

			if (!chat) {
				throw new GraphQLError('No such chat exists');
			}

			return chat;
		},
	},

	Mutation: {
		addUser: async (
			_parent,
			{ username, password, confirmPassword, avatar },
			context
		) => {
			// check if passwords match
			if (password !== confirmPassword) {
				throw new GraphQLError('Passwords do not match!');
			}

			const existingUser = await User.findOne({ username });
			if (existingUser) {
				console.log(existingUser);
				throw new GraphQLError(
					`The username: ${username} is already in use!`
				);
			}

			// create avatar url
			const avatarUrl = `https://robohash.org/${username}?set=set${avatar}`;

			const user = await User.create({
				username,
				password,
				avatar: avatarUrl,
			});

			const token = signToken(user, context.res);
			console.log(user);

			return { token, user };
		},
		login: async (_parent, { username, password }, context) => {
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
			const token = signToken(user, context.res);
			return { token, user };
		},
		logout: (_parent, _args, context) => {
			if (!context.user) {
				return 'No user to log out!';
			}
			// destroy cookie
			context.res.cookie('jwt', '', { maxAge: 0 });

			return 'Successfully logged out user';
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

			// publish event to the NEW_MESSAGE topic
			pubsub.publish('NEW_MESSAGE', {
				newMessage: {
					_id: newMessage._id,
					createdAt: new Date(),
					receiverId,
					content,
					senderId,
				},
			});

			// save updated/new documents to db in parallel
			await Promise.all([chat.save(), newMessage.save()]);

			return newMessage;
		},
	},
	Message: {
		senderId: async (parent) => {
			return await User.findById(parent.senderId);
		},
		receiverId: async (parent) => {
			return await User.findById(parent.receiverId);
		},
	},
	Subscription: {
		newMessage: {
			// maybe implement withFilter here
			subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE']),
		},
	},
};

export default resolvers;
