const typeDefs = `#graphql
	type User {
		_id: ID!
		username: String!
		email: String!
		password: String!
		avatar: String!
		friends: [User!]!
		# timestamps
	}

	type Message {
		_id: ID!
		senderId: User!
		receiverId: User!
		content: String!
		# timestamps
	}

	type Chat {
		_id: ID!
		participants: [User!]!
		messages: [Message!]!
		# timestamps
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		users: [User]!
		user(userId: ID!): User
		me: User
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!, avatar: Int!): Auth
		login(username: String!, password: String!): Auth

		sendMessage(receiverId: ID!, content: String!, senderId: ID): Message
	}
`;

export default typeDefs;
