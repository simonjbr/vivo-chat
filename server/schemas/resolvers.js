import { User } from '../models/index.js';
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
			if(context.user) {
				return User.findById(context.user._id)
			}
		}
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
	},
};

export default resolvers;
