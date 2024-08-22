import { useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { LOGGED_IN, LOGGED_OUT } from '../utils/subscriptions';
import { ONLINE_USERS } from '../utils/queries';

const OnlineUserContext = createContext();

export const useOnlineUserContext = () => useContext(OnlineUserContext);

export const OnlineUserContextProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { subscribeToMore, data, refetch } = useQuery(ONLINE_USERS);

	useEffect(() => {
		if (data) {
			setOnlineUsers(data.getOnlineUsers);
		}

		return () => setOnlineUsers([]);
	}, [data]);

	useEffect(() => {
		subscribeToMore({
			document: LOGGED_IN,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newOnlineUser = subscriptionData.data.loggedIn;

				if (prev.getOnlineUsers.includes(newOnlineUser)) {
					return prev;
				}

				return {
					...prev,
					getOnlineUsers: [...prev.getOnlineUsers, newOnlineUser],
				};
			},
		});
	}, []);

	useEffect(() => {
		subscribeToMore({
			document: LOGGED_OUT,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const loggedOutUser = subscriptionData.data.loggedOut;

				const nextGetOnlineUsers = prev.getOnlineUsers.filter(
					(user) => loggedOutUser !== user
				);

				return { getOnlineUsers: nextGetOnlineUsers };
			},
		});
	}, []);

	return (
		<OnlineUserContext.Provider value={{ onlineUsers, refetch }}>
			{children}
		</OnlineUserContext.Provider>
	);
};
