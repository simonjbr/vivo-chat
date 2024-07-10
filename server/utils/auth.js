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

// auth middleware verifies token and adds user data to request object
export const authMiddleware = ({ req }) => {
	// get token from headers
	let token = req.headers.authorization;

	// remove 'Bearer ' from token string
	if (req.headers.authorization) {
		token = token.split(' ').pop().trim();
	}

	// if token empty return unaltered request object
	if (!token) {
		return req;
	}

	// verify token and extract user data
	try {
		const { data } = jwt.verify(token, process.env.JWT_SECRET, {
			maxAge: process.env.TOKEN_EXP,
		});
		req.user = data;
	} catch (error) {
		console.log('Invalid token');
		console.error(error);
	}

	// return updated request object so it can be passed to the resolver as context
	return req;
};

export const signToken = ({ username, email, _id }) => {
	const payload = { username, email, _id };
	return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXP,
	});
};
