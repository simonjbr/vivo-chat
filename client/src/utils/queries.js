import { gql } from '@apollo/client';

export const USERS = gql`
	query Users {
		users {
			_id
			username
			avatar
			friends {
				_id
				username
			}
		}
	}
`;

export const MESSAGES = gql`
	query Messages($receiverId: ID!, $senderId: ID) {
		messages(receiverId: $receiverId, senderId: $senderId) {
			_id
			senderId {
				_id
				username
				avatar
			}
			receiverId {
				_id
				username
			}
			content
			createdAt
		}
	}
`;

export const CHATS = gql`
	query Chats {
		chats {
			_id
			participants {
				_id
				username
				avatar
			}
		}
	}
`;

export const CHAT = gql`
	query Chat($participantOne: ID!, $participantTwo: ID!) {
		chat(participantOne: $participantOne, participantTwo: $participantTwo) {
			_id
			participantOne {
				_id
				username
			}
			participantTwo {
				_id
				username
			}
			participants {
				_id
				username
			}
			messages {
				_id
				senderId {
					_id
					avatar
				}
				receiverId {
					_id
				}
				content
				createdAt
			}
		}
	}
`;

export const ONLINE_USERS = gql`
	query GetOnlineUsers {
		getOnlineUsers
	}
`;

export const VERIFY_TOKEN = gql`
	query VerifyToken($token: ID!) {
		verifyToken(token: $token) {
			token
			user {
				_id
				username
			}
		}
	}
`;
