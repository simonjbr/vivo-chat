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
	// const { data, error, loading } = useQuery(MESSAGES, {
	// 	variables: {
	// 		receiverId: selectedChat._id,
	// 		senderId: authUser._id,
	// 	},
	// });
	const { data, error, loading } = useQuery(CHAT, {
		variables: {
			participantOne: authUser._id,
			participantTwo: selectedChat._id,
		},
	});
	const participants = data?.chat.participants;

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
			return;
		}
		if (!data?.chat) {
			setMessages([]);
			return;
		}
		if (data?.chat) {
			setMessages(data.chat.messages);
		}
	}, [data, error]);

	const participantsInclude = (id) => {
		if (!participants) {
			return false;
		}
		for (const participant of participants) {
			if (participant._id === id) return true;
		}
		return false;
	};

	useEffect(() => {
		if (!subscription.loading && subscription.data) {
			const newMessage = subscription.data.newMessage;

			if (
				participantsInclude(newMessage.senderId._id) &&
				participantsInclude(newMessage.receiverId._id)
			) {
				setMessages([...messages, newMessage]);
			}
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
