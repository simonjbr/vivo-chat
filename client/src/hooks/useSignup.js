import { useState } from 'react';
import toast from 'react-hot-toast';

import { ADD_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import { useAuthContext } from '../context/AuthContext';

const useSignup = ({ username, password, confirmPassword, avatar }) => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();
	const [addUser] = useMutation(ADD_USER, {
		variables: {
			username,
			password,
			confirmPassword,
			avatar,
		},
	});

	const signup =
		async (/* { username, password, confirmPassword, avatar } */) => {
			const isValidInput = validateInput(
				username,
				password,
				confirmPassword,
				avatar
			);
			if (!isValidInput) {
				return false;
			}

			setLoading(true);
			try {
				const { data, error } = await addUser(
					username,
					password,
					confirmPassword,
					avatar
				);
				if (error) {
					throw new Error(error);
				}

				// persist authUser in localStorage
				localStorage.setItem(
					'vivo-user',
					JSON.stringify(data.addUser.user)
				);

				// add user to context
				setAuthUser(data.addUser.user);

				toast.success(`Welcome ${data.addUser.user.username}!`);
			} catch (error) {
				toast.error(error.message);
				return false;
			} finally {
				setLoading(false);
			}
			return true;
		};

	return { loading, signup };
};

const validateInput = (username, password, confirmPassword, avatar) => {
	if (!username || !password || !confirmPassword || !avatar) {
		toast.error('Please fill in all fields');
		return false;
	}

	if (password !== confirmPassword) {
		toast.error('Password does not match Confirm Password');
		return false;
	}

	if (password.length < 6) {
		toast.error('Password must be at least 6 characters');
		return false;
	}

	return true;
};

export default useSignup;
