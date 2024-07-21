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
			}
			receiverId {
				_id
				username
			}
			content
		}
	}
`;
