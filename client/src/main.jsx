import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AuthProvider } from './context/AuthContext.jsx';

// graphql subscription/websocket imports
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { OnlineUserContextProvider } from './context/OnlineUserContext.jsx';
// import { WebSocketLink } from '@apollo/client/link/ws';

// create http link for queries and mutations
const httpLink = new HttpLink({
	uri: '/graphql',
});

// create websocket link for subscription operations
const wsLink = new GraphQLWsLink(
	createClient({
		url: '/subscription',
		connectionParams: {
			authToken: JSON.parse(localStorage.getItem('vivo-user')) || null,
		},
	})
);

// split link assesses whether to use http or ws and
// returns the appropriate link for ApolloClient
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);

// create apollo client with splitLink
const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<BrowserRouter>
				<AuthProvider>
					<OnlineUserContextProvider>
						<App />
					</OnlineUserContextProvider>
				</AuthProvider>
			</BrowserRouter>
		</ApolloProvider>
	</React.StrictMode>
);
