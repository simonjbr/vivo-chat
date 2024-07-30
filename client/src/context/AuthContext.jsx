import { useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { VERIFY_TOKEN } from '../utils/queries';

const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const { data } = useQuery(VERIFY_TOKEN, {
		variables: {
			token: JSON.parse(localStorage.getItem('vivo-user')) || null,
		},
	});

	useEffect(() => {
		if (data?.verifyToken.user === null) {
			localStorage.removeItem('vivo-user');
			return;
		}

		if (data?.verifyToken.user) {
			console.log('data:', data);
			setAuthUser(data.verifyToken.user);
		}

	}, [data]);

	const [authUser, setAuthUser] = useState(
		data?.verifyToken.user || null
	);
	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};
