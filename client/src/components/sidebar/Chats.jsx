import useGetChats from '../../hooks/useGetChats';
import Chat from './Chat';
import { useAuthContext } from '../../context/AuthContext';
import useChatStore from '../../store/useChatStore';
import { useEffect, useState } from 'react';
import { useOnlineUserContext } from '../../context/OnlineUserContext';

const Chats = () => {
	const { loading, chats } = useGetChats();
	const { authUser } = useAuthContext();
	const { setSelectedChat } = useChatStore();
	const { onlineUsers } = useOnlineUserContext();
	const [onlineChats, setOnlineChats] = useState([]);
	const [offlineChats, setOfflineChats] = useState([]);

	useEffect(() => {
		if (!loading && chats.length > 0) {
			const defaultChat =
				chats[0]._id !== authUser._id ? chats[0] : chats[1];
			setSelectedChat(defaultChat);

			sortByOnlineStatus(chats);
		}
	}, [chats, onlineUsers]);

	const sortByOnlineStatus = (chats) => {
		const online = [];
		const offline = [];

		chats.forEach((chat) => {
			if (chat._id !== authUser._id && onlineUsers.includes(chat._id)) {
				online.push(chat);
			} else {
				offline.push(chat);
			}

			setOnlineChats(online);
			setOfflineChats(offline);
		});
	};

	return (
		<div className="py-2 flex flex-col">
			{loading ? (
				<span className="loading loading-spinner mx-auto"></span>
			) : (
				<>
					{onlineChats.map((chat, index) => {
						return authUser._id !== chat._id ? (
							<Chat
								key={chat._id}
								chat={chat}
								lastIndex={index === onlineChats.length - 1}
							/>
						) : (
							''
						);
					})}
					{onlineChats.length > 0 ? <div className="divider my-0 py-0 h-1 divider-success" /> : ''}
					{offlineChats.map((chat, index) => {
						return authUser._id !== chat._id ? (
							<Chat
								key={chat._id}
								chat={chat}
								lastIndex={index === offlineChats.length - 1}
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
