// import useGetChats from '../../hooks/useGetChats';
import Chat from './Chat';
import { useAuthContext } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useOnlineUserContext } from '../../context/OnlineUserContext';
import useGetUsers from '../../hooks/useGetUsers';

const Chats = () => {
	const { loading, users } = useGetUsers();
	const { authUser } = useAuthContext();
	const { onlineUsers } = useOnlineUserContext();
	const [onlineUsersSection, setOnlineUsersSection] = useState([]);
	const [offlineUsersSection, setOfflineUsersSection] = useState([]);

	useEffect(() => {
		if (!loading && users.length > 0) {
			sortByOnlineStatus(users);
		}
	}, [users, onlineUsers]);

	const sortByOnlineStatus = (users) => {
		const online = [];
		const offline = [];

		users.forEach((user) => {
			// const isParticipantOne = chat.participantOne._id === authUser._id;
			// const participant = isParticipantOne
			// 	? chat.participantTwo
			// 	: chat.participantOne;

			if (user._id !== authUser._id && onlineUsers.includes(user._id)) {
				online.push(user);
			} else {
				offline.push(user);
			}

			setOnlineUsersSection(online);
			setOfflineUsersSection(offline);
		});
	};

	return (
		<div className="py-2 flex flex-col">
			{loading ? (
				<span className="loading loading-spinner mx-auto"></span>
			) : (
				<>
					{onlineUsersSection.map((user, index) => {
						return authUser._id !== user._id ? (
							<Chat
								key={user._id}
								user={user}
								lastIndex={index === onlineUsersSection.length - 1}
							/>
						) : (
							''
						);
					})}
					{onlineUsersSection.length > 0 ? (
						<div className="divider my-0 py-0 h-1 divider-success" />
					) : (
						''
					)}
					{offlineUsersSection.map((user, index) => {
						return authUser._id !== user._id ? (
							<Chat
								key={user._id}
								user={user}
								lastIndex={index === offlineUsersSection.length - 1}
							/>
						) : (
							''
						);
					})}
				</>
			)}
		</div>
	);
};

export default Chats;
