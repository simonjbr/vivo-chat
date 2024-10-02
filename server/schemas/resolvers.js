import { Chat, Message, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

import { PubSub, withFilter } from 'graphql-subscriptions';
import onlineUsers from '../utils/onlineUsers.js';

import jwt from 'jsonwebtoken';

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
			// const chat = await Chat.findOne({
			// 	participants: {
			// 		$all: [senderId, receiverId],
			// 	},
			// }).populate('messages');
			const chat = await Chat.findOne({
				$or: [
					{
						participantOne: senderId,
						participantTwo: receiverId,
					},
					{
						participantOne: receiverId,
						participantTwo: senderId,
					},
				],
			}).populate('messages');

			// if no chat found return empty array
			if (!chat) {
				return [];
			}

			// otherwise return chat's messages array
			return chat.messages;
		},
		// refactor to determine if there are notifications
		chats: async (_parent, _args, context) => {
			const chats = await Chat.find({
				$or: [
					{
						participantOne: context.user._id,
					},
					{
						participantTwo: context.user._id,
					},
				],
			})
				.populate(['participantOne', 'participantTwo'])
				.populate('messages');

			if (!chats) {
				throw new GraphQLError('Could not find any chats');
			}

			return chats;
		},
		chat: async (_parent, { participantOne, participantTwo }, context) => {
			const chat = await Chat.findOne({
				$or: [
					{
						participantOne: participantOne,
						participantTwo: participantTwo,
					},
					{
						participantOne: participantTwo,
						participantTwo: participantOne,
					},
				],
			})
				.populate(['participantOne', 'participantTwo'])
				.populate('messages');

			if (!chat) {
				throw new GraphQLError('No such chat exists');
			}

			// update lastSeenBy timestamp for appropriate user
			if (chat.participantOne._id.toString() === context.user._id) {
				chat.lastSeenByOne = new Date().toString();
			} else if (
				chat.participantTwo._id.toString() === context.user._id
			) {
				chat.lastSeenByTwo = new Date().toString();
			}

			await chat.save();

			return chat;
		},
		getOnlineUsers: async (_parent, _args, _context) => {
			return onlineUsers;
		},
		verifyToken: async (_parent, { token }, context) => {
			if (token !== context.cookies.jwt) {
				// remove user from onlineUsers set
				onlineUsers.delete(context.user._id);

				pubsub.publish('LOGGED_OUT', {
					loggedOut: context.user._id,
				});

				return {
					token,
					user: null,
				};
			}

			const verifiedToken = jwt.verify(token, process.env.JWT_SECRET, {
				maxAge: process.env.TOKEN_EXP,
			});

			if (verifiedToken) {
				return {
					token,
					user: verifiedToken.data,
				};
			}

			// remove user from onlineUsers set
			onlineUsers.delete(context.user._id);

			pubsub.publish('LOGGED_OUT', {
				loggedOut: context.user._id,
			});

			return {
				token,
				user: null,
			};
		},
		notifications: async (
			_parent,
			{
				/* userId */
			},
			context
		) => {
			const userId = context.user._id;
			const chats = await Chat.find(
				{
					$or: [
						{ participantOne: userId },
						{ participantTwo: userId },
					],
				},
				{
					messages: {
						$slice: -1,
					},
				}
			).populate('messages');

			const notifications = [];

			chats.forEach((chat) => {
				// console.log(chat.participantOne._id);
				const userIsParticipantOne =
					chat.participantOne._id.toString() === userId;
				// const userParticipant = userIsParticipantOne
				// 	? chat.participantOne
				// 	: chat.participantTwo;
				const otherParticipant = userIsParticipantOne
					? chat.participantTwo
					: chat.participantOne;
				const userLastSeenBy = userIsParticipantOne
					? chat.lastSeenByOne
					: chat.lastSeenByTwo;

				if (
					chat.messages.at(-1)?.senderId._id.toString() !== userId &&
					userLastSeenBy < chat.messages.at(-1)?.createdAt
				) {
					notifications.push(otherParticipant._id);
				}
			});

			return notifications;
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

			// publish signedUp event for subscription
			pubsub.publish('SIGNED_UP', {
				signedUp: user,
			});
			// also publish loggedIn event for subscription
			pubsub.publish('LOGGED_IN', {
				loggedIn: user._id.toString(),
			});

			return { token, user };
		},
		login: async (_parent, { username, password }, context) => {
			const user = await User.findOne({ username });

			if (!user) {
				throw new GraphQLError('Incorrect username or password');
			}

			const correctPassword = await user.isCorrectPassword(password);

			if (!correctPassword) {
				throw new GraphQLError('Incorrect username or password');
			}

			// if user already logged in throw error
			if (onlineUsers.has(user._id.toString())) {
				throw new GraphQLError('User is aleady logged in!');
			}

			// generate token for authenticated user
			const token = signToken(user, context.res);

			// push user's _id onto onlineUsers set
			onlineUsers.add(user._id.toString());

			// publish loggedIn event for subscription
			pubsub.publish('LOGGED_IN', {
				loggedIn: user._id.toString(),
			});

			return { token, user };
		},
		logout: (_parent, _args, context) => {
			if (!context.user) {
				return 'No user to log out!';
			}

			// remove user from onlineUsers set
			onlineUsers.delete(context.user._id);

			pubsub.publish('LOGGED_OUT', {
				loggedOut: context.user._id,
			});

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
			// let chat = await Chat.findOne({
			// 	participants: {
			// 		$all: [senderId, receiverId],
			// 	},
			// });
			let chat = await Chat.findOne({
				$or: [
					{
						participantOne: senderId,
						participantTwo: receiverId,
					},
					{
						participantOne: receiverId,
						participantTwo: senderId,
					},
				],
			});

			// if chat doesn't exist create one
			if (!chat) {
				// chat = await Chat.create({
				// 	participants: [senderId, receiverId],
				// });
				chat = await Chat.create({
					participantOne: senderId,
					participantTwo: receiverId,
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

			// update lastSeenBy timestamp for appropriate user
			if (chat.participantOne._id.toString() === context.user._id) {
				chat.lastSeenByOne = new Date().toString();
			} else if (
				chat.participantTwo._id.toString() === context.user._id
			) {
				chat.lastSeenByTwo = new Date().toString();
			}

			// save updated/new documents to db in parallel
			await Promise.all([chat.save(), newMessage.save()]);

			return newMessage;
		},
		createChat: async (
			_parent,
			{ participantOne, participantTwo },
			context
		) => {
			if (!context.user) {
				throw new GraphQLError('Unauthorized');
			}

			// try find an existing Chat with specified participants
			// let existingChat = await Chat.findOne({
			// 	participants: {
			// 		$all: [participantOne, participantTwo],
			// 	},
			// });
			const existingChat = await Chat.findOne({
				$or: [
					{
						participantOne: participantOne,
						participantTwo: participantTwo,
					},
					{
						participantOne: participantTwo,
						participantTwo: participantOne,
					},
				],
			});

			if (existingChat) {
				throw new GraphQLError(
					'Chat with these participants already exists'
				);
			}

			// const chat = await Chat.create({
			// 	participants: [participantOne, participantTwo],
			// });
			const chat = await Chat.create({
				participantOne: participantOne,
				participantTwo: participantTwo,
			});

			if (!chat) {
				throw new GraphQLError('Failed to create Chat');
			}

			return await chat.populate(['participantOne', 'participantTwo']);
		},
		isTypingMutation: async (
			_parent,
			{ receiverId, senderId, isTyping },
			context
		) => {
			pubsub.publish('IS_TYPING', {
				isTypingSub: { senderId, receiverId, isTyping },
			});
		},
		updateLastSeen: async (_parent, { selectedChatId }, context) => {
			const chat = await Chat.findOne({
				$or: [
					{
						participantOne: selectedChatId,
						participantTwo: context.user._id,
					},
					{
						participantOne: context.user._id,
						participantTwo: selectedChatId,
					},
				],
			});

			// create new dat object for updating lastSeenBy
			const date = new Date();
			// add 1 second to account for processing time
			const updatedCreatedAt = date.setSeconds(date.getSeconds() + 1);

			// update lastSeenBy timestamp for appropriate user
			if (chat.participantOne._id.toString() === context.user._id) {
				chat.lastSeenByOne = updatedCreatedAt.toString();
			} else if (
				chat.participantTwo._id.toString() === context.user._id
			) {
				chat.lastSeenByTwo = updatedCreatedAt.toString();
			}

			await chat.save();

			return true;
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
			// only sunscribe authUsers who are sender/receiver of the new message
			subscribe: withFilter(
				() => pubsub.asyncIterator(['NEW_MESSAGE']),
				(payload, _variables, context) => {
					if (!context.authUser) {
						console.log(
							`newMessage: No authUser in subscription context`
						);
						return false;
					}

					return (
						context.authUser._id ===
							payload.newMessage.receiverId ||
						context.authUser._id === payload.newMessage.senderId
					);
				}
			),
		},
		loggedIn: {
			subscribe: () => pubsub.asyncIterator(['LOGGED_IN']),
		},
		loggedOut: {
			subscribe: () => pubsub.asyncIterator(['LOGGED_OUT']),
		},
		signedUp: {
			subscribe: () => pubsub.asyncIterator(['SIGNED_UP']),
		},
		isTypingSub: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(['IS_TYPING']),
				(payload, _variables, context) => {
					if (!context.authUser) {
						console.log(
							`IsTypingSub: No authUser in subscription context`
						);
						return false;
					}

					return (
						payload.isTypingSub.receiverId === context.authUser._id
					);
				}
			),
		},
	},
};

export default resolvers;
