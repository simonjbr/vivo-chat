import { useQuery } from '@apollo/client';
import useChatStore from '../../store/useChatStore';
import Message from './Message';
import { MESSAGES } from '../../utils/queries';
import { useEffect, useState } from 'react';

const Messages = () => {
	const { selectedChat } = useChatStore();
	const { data, error, loading } = useQuery(MESSAGES, {
		variables: {
			receiverId: selectedChat._id,
		},
	});

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (data) {
			setMessages(data.messages);
		}
	}, [data]);
	return (
		<div className="px-4 flex-1 overflow-auto">
			{messages.map((message) => (<Message key={message._id} message={message} />))}
		</div>
	);
};
export default Messages;
