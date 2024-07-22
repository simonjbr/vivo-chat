import { useQuery } from '@apollo/client';
import useChatStore from '../../store/useChatStore';
import Message from './Message';
import { MESSAGES } from '../../utils/queries';
import { useEffect, useState } from 'react';
import MessageSkeleton from '../skeleton/MessageSkeleton';
import { useAuthContext } from '../../context/AuthContext';

const Messages = () => {
	const { selectedChat } = useChatStore();
	const { authUser } = useAuthContext();
	const { data, error, loading } = useQuery(MESSAGES, {
		variables: {
			receiverId: selectedChat._id,
			senderId: authUser._id,
		},
	});

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (error) {
			console.log(error.message);
		}
		if (data) {
			setMessages(data.messages);
		}
	}, [data, error]);
	return (
		<div className="px-4 flex-1 overflow-auto">
			{loading ? (
				[...Array(2)].map((_, index) => <MessageSkeleton key={index} />)
			) : messages.length === 0 ? (
				<p className="text-center">Send a message to start the chat</p>
			) : (
				messages.map((message) => (
					<Message key={message._id} message={message} />
				))
			)}
		</div>
	);
};
export default Messages;
