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
		if (!loading) {
			setSelectedChat(chats[0]);
		}
	}, [chats])

	return (
		<div className="py-2 flex flex-col overflow-auto">
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
