import { useState } from 'react';
import { LOGOUT } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const [logoutMutation] = useMutation(LOGOUT);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const { data, error } = await logoutMutation();
			if (error) {
				throw new Error(error);
			}
			toast.success(data.logout)

			localStorage.removeItem('vivo-user');
			setAuthUser(null);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
