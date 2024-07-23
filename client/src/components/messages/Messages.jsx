import { useQuery } from '@apollo/client';
import useChatStore from '../../store/useChatStore';
import Message from './Message';
import { MESSAGES } from '../../utils/queries';
import { useEffect, useRef, useState } from 'react';
import MessageSkeleton from '../skeleton/MessageSkeleton';
import { useAuthContext } from '../../context/AuthContext';
import { useSubscription } from '@apollo/client';
import { NEW_MESSAGE } from '../../utils/subscriptions';

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
	const lastMessageRef = useRef();

	const subscription = useSubscription(NEW_MESSAGE);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}, [selectedChat, messages]);

	useEffect(() => {
		if (error) {
			console.log(error.message);
		}
		if (data) {
			setMessages(data.messages);
		}
	}, [data, error]);

	useEffect(() => {
		if (!subscription.loading && subscription.data) {
			setMessages([...messages, subscription.data.newMessage]);
		}
	}, [subscription]);

	return (
		<div className="px-4 flex-1 overflow-auto">
			{loading ? (
				[...Array(2)].map((_, index) => <MessageSkeleton key={index} />)
			) : messages.length === 0 ? (
				<p className="text-center">Send a message to start the chat</p>
			) : (
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))
			)}
		</div>
	);
};
export default Messages;
