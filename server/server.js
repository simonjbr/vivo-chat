import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { authMiddleware } from './utils/auth.js';

import { typeDefs, resolvers } from './schemas/index.js';
import mongoose from 'mongoose';
import connectionString from './config/connection.js';
import cookieParser from 'cookie-parser';

// graphql subscription/websocket imports
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 5000;
const app = express();

// http server to wrap express app and websocket servers
const httpServer = createServer(app);

// create an instance of a GraphQLSchema for both Apollo server and subscription server
const schema = makeExecutableSchema({ typeDefs, resolvers });

// set up Apollo server
const server = new ApolloServer({
	schema,
	plugins: [
		// proper shutdown for httpServer
		ApolloServerPluginDrainHttpServer({ httpServer }),
		// proper shutdown for the WebSocketServer
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

// create a WebSocketServer to use as the subscription server
const wsServer = new WebSocketServer({
	server: httpServer,
	path: '/subscription',
});

// provide context to subscription
const getDynamicContext = async (ctx, msg, args) => {
	if (ctx.connectionParams.authToken) {
		const authToken = ctx.connectionParams.authToken;

		if (authToken) {
			const { data } = jwt.verify(authToken, process.env.JWT_SECRET, {
				maxAge: process.env.TOKEN_EXP,
			});

			return { authUser: data };
		}
	}

	return { authUser: null };
};

// start WebSocketServer listening
const serverCleanup = useServer(
	{
		schema,
		context: async (ctx, msg, args) => {
			return getDynamicContext(ctx, msg, args);
		},
	},
	wsServer
);

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

	const __dirname = path.resolve();

	// if in production serve client side bundle
	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, '/client/dist')));

		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, '/client/dist/index.html'));
		});
	}

	mongoose.connect(connectionString);
	const db = mongoose.connection;

	// once connection to db is open begin listening
	db.once('open', () => {
		httpServer.listen(PORT, () => {
			console.log(`API server running on port ${PORT}!`);
			console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
		});
	});
};

startApolloServer();
