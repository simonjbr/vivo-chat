import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
	return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	return (
		<NotificationContext.Provider
			value={{ notifications, setNotifications }}
		>
			{children}
		</NotificationContext.Provider>
	);
};
