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
