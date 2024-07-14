import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { authMiddleware } from './utils/auth.js';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5000;
const app = express();

// set up Apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const startApolloServer = async () => {
	await server.start();

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(cookieParser());

	// use Apollo server middleware with context
	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: authMiddleware,
		})
	);

	// if in production serve client side bundle
	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, '../client/dist')));

		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, '../client/dist/index.html'));
		});
	}

	// once connection to db is open begin listening
	db.once('open', () => {
		app.listen(PORT, () => {
			console.log(`API server running on port ${PORT}!`);
			console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
		});
	});
};

startApolloServer();
