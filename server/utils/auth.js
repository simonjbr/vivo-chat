import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

export const AuthenticationError = new GraphQLError(
	'Could not authenticate user.',
	{
		extensions: {
			code: 'UNAUTHENTICATED',
		},
	}
);

export const signToken = ({ username, email, _id }) => {
	const payload = { username, email, _id };
	return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXP,
	});
};
