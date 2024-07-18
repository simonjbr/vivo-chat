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
		setLoading(true);
		try {
			const { data, error } = await loginMutation(username, password);

			if (error) {
				throw new Error(error);
			}

			localStorage.setItem('vivo-user', JSON.stringify(data.login.user));
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
export default useLogin;
