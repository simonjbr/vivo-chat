import { gql } from '@apollo/client';

export const ADD_USER = gql`
	mutation AddUser(
		$username: String!
		$password: String!
		$confirmPassword: String!
		$avatar: Int!
	) {
		addUser(
			username: $username
			password: $password
			confirmPassword: $confirmPassword
			avatar: $avatar
		) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout
	}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const SEND_MESSAGE = gql`
	mutation SendMessage($receiverId: ID!, $content: String!, $senderId: ID) {
		sendMessage(
			receiverId: $receiverId
			content: $content
			senderId: $senderId
		) {
			_id
			senderId {
				_id
				username
			}
			receiverId {
				_id
				username
			}
			content
		}
	}
`;

export const CREATE_CHAT = gql`
	mutation CreateChat($participantOne: ID!, $participantTwo: ID!) {
		createChat(
			participantOne: $participantOne
			participantTwo: $participantTwo
		) {
			_id
			participants {
				_id
				username
			}
			messages {
				_id
				senderId {
					_id
					username
				}
				receiverId {
					_id
					username
				}
				content
				createdAt
			}
		}
	}
`;
