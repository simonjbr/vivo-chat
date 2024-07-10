import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

const resolvers = {
	Query: {
		users: async () => {
			return User.find();
		},
	},

	Mutation: {
		addUser: async (_parent, { username, email, password, avatar }) => {
			// check if username unique
			// const existingUsername = await User.findOne({ username });
			// if (existingUsername) {
			// 	return;
			// }

			// check if passwords match
			// if (password !== confirmPassword) {
			// 	return { error: 'Passwords do not match' };
			// }

			// create avatar url
			// move this to pre save hook?
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
	},
};

export default resolvers;
