import useGetChats from '../../hooks/useGetChats';
import Chat from './Chat';
import { useAuthContext } from '../../context/AuthContext';
import useChatStore from '../../store/useChatStore';
import { useEffect } from 'react';

const Chats = () => {
	const { loading, chats } = useGetChats();
	const { authUser } = useAuthContext();
	const { setSelectedChat } = useChatStore();

	useEffect(() => {
		if (!loading && chats.length > 0) {
			const defaultChat =
				chats[0]._id !== authUser._id ? chats[0] : chats[1];
			setSelectedChat(defaultChat);
		}
	}, [chats]);

	return (
		<div className="py-2 flex flex-col">
			{loading ? (
				<span className="loading loading-spinner mx-auto"></span>
			) : (
				chats.map((chat, index) => {
					return authUser._id !== chat._id ? (
						<Chat
							key={chat._id}
							chat={chat}
							lastIndex={index === chats.length - 1}
						/>
					) : (
						''
					);
				})
			)}
		</div>
	);
};

export default Chats;
