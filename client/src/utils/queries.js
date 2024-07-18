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
