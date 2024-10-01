import { useEffect } from 'react';
import useChatStore from '../../store/useChatStore';
import MessageInput from './MessageInput';
import Messages from './Messages';

const MessageContainer = () => {
	const { selectedChat, setSelectedChat } = useChatStore();

	useEffect(() => {
		// cleanup on unmount
		return () => setSelectedChat(null);
	}, [setSelectedChat]);

	return (
		<div className="flex flex-col w-full static">
			<Messages />
			{selectedChat ? <MessageInput /> : ''}
		</div>
	);
};

export default MessageContainer;
