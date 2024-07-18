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
	// get token from cookie
	let token = req.headers.cookie;

	// console.log(req.headers.authorization);

	// remove 'jwt=' from cookie string
	if (req.headers.cookie) {
		token = token.split('=').pop().trim();
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
		// console.log(data);
	} catch (error) {
		console.log('Invalid token');
		console.error(error);
	}

	// return updated request object so it can be passed to the resolver as context
	return req;
};

// sign token and set cookie
export const signToken = ({ username, _id }, res) => {
	const payload = { username, _id };
	const token = jwt.sign({ data: payload }, process.env.JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXP,
	});

	// set cookie
	res.cookie('jwt', token, {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 2 * 60 * 60 * 1000,
	});

	return token;
};
