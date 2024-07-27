import { useQuery } from '@apollo/client';
import useChatStore from '../../store/useChatStore';
import Message from './Message';
import { CHAT } from '../../utils/queries';
import { useEffect, useRef, useState } from 'react';
import MessageSkeleton from '../skeleton/MessageSkeleton';
import { useAuthContext } from '../../context/AuthContext';
import { useSubscription } from '@apollo/client';
import { NEW_MESSAGE } from '../../utils/subscriptions';

const Messages = () => {
	const { selectedChat } = useChatStore();
	const { authUser } = useAuthContext();
	const { data, error, loading, refetch } = useQuery(CHAT, {
		variables: {
			participantOne: authUser._id,
			participantTwo: selectedChat._id,
		},
	});
	const [messages, setMessages] = useState([]);
	const lastMessageRef = useRef();

	const subscription = useSubscription(NEW_MESSAGE, {
		variables: {
			authUserId: authUser._id,
			selectedChatId: selectedChat._id,
		},
	});

	useEffect(() => {
		refetch();
	}, [selectedChat]);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 1300);
	}, [selectedChat, messages]);

	useEffect(() => {
		if (error) {
			console.log(error.message);
			return;
		}
		// if no chat exists set messages to empty array
		if (!data?.chat) {
			setMessages([]);
			return;
		}
		if (data?.chat) {
			setMessages(data.chat.messages);
		}
	}, [data, error]);

	useEffect(() => {
		if (!subscription.loading && subscription.data) {
			const newMessage = subscription.data.newMessage;

			if (
				newMessage.senderId._id === selectedChat._id ||
				newMessage.receiverId._id === selectedChat._id
			) {
				setMessages([...messages, newMessage]);
				return;
			}

			// notifications implemented here
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
