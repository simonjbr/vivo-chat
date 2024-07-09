import { User } from '../models/index.js';

const resolvers = {
	Query: {
		users: async () => {
			return User.find();
		},
	},

	Mutation: {
		addUser: async (_parent, { username, email, password, avatar }) => {
			return User.create({
				username,
				email,
				password,
				avatar,
			});
		},
	},
};

export default resolvers;
