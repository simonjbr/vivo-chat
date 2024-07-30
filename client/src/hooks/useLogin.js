import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { LOGIN } from '../utils/mutations';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useLogin = ({ username, password }) => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();
	const [loginMutation] = useMutation(LOGIN, {
		variables: {
			username,
			password,
		},
	});

	const login = async () => {
		const isValidInput = validateInput(username, password);
		if (!isValidInput) {
			return false;
		}

		setLoading(true);
		try {
			const { data, error } = await loginMutation(username, password);

			if (error) {
				throw new Error(error);
			}

			localStorage.setItem('vivo-user', JSON.stringify(data.login.token));
			setAuthUser(data.login.user);

			toast.success(`Welcome back ${data.login.user.username}!`);
		} catch (error) {
			toast.error(error.message);
			return false;
		} finally {
			setLoading(false);
		}
		return true;
	};

	return { loading, login };
};

const validateInput = (username, password) => {
	if (!username || !password) {
		toast.error('Please fill in all fields');
		return false;
	}

	return true;
};
export default useLogin;
