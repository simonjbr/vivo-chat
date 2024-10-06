import { gql } from '@apollo/client';

export const NEW_MESSAGE = gql`
	subscription NewMessage($authUserId: ID!) {
		newMessage(authUserId: $authUserId) {
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
			_id
			createdAt
		}
	}
`;

export const LOGGED_IN = gql`
	subscription LoggedIn {
		loggedIn
	}
`;

export const LOGGED_OUT = gql`
	subscription LoggedOut {
		loggedOut
	}
`;

export const SIGNED_UP = gql`
	subscription SignedUp {
		signedUp {
			_id
			username
			avatar
			friends {
				_id
			}
		}
	}
`;

export const IS_TYPING_SUB = gql`
	subscription IsTypingSub {
		isTypingSub {
			senderId
			receiverId
			isTyping
		}
	}
`;

export const LAST_SEEN_UPDATED_SUB = gql`
	subscription LastSeenUpdatedSub {
		lastSeenUpdatedSub {
			senderId
			receiverId
			lastSeen
		}
	}
`;
