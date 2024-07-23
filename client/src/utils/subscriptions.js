import { gql } from '@apollo/client';

export const NEW_MESSAGE = gql`
	subscription NewMessage {
		newMessage {
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
