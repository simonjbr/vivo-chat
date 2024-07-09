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

	type Query {
		users: [User]!
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!, avatar: String!): User
	}
`;

export default typeDefs;
