import { useQuery } from '@apollo/client';
import useChatStore from '../../store/useChatStore';
import Message from './Message';
import { CHAT } from '../../utils/queries';
import { useEffect, useRef, useState } from 'react';
import MessageSkeleton from '../skeleton/MessageSkeleton';
import { useAuthContext } from '../../context/AuthContext';
import { useSubscription } from '@apollo/client';
import { IS_TYPING_SUB, NEW_MESSAGE } from '../../utils/subscriptions';
import messagePopAlert from '../../assets/happy-pop-3-185288.mp3';
import typingPopAlert from '../../assets/multi-pop-1-188165.mp3';
import { useNotificationContext } from '../../context/NotificationContext';
import { TiMessageTyping } from 'react-icons/ti';

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
	const { notifications, setNotifications } = useNotificationContext();

	const subscription = useSubscription(NEW_MESSAGE, {
		variables: {
			authUserId: authUser._id,
			selectedChatId: selectedChat._id,
		},
	});

	const [typingIndicator, setTypingIndicator] = useState(false);

	const isTypingSubscription = useSubscription(IS_TYPING_SUB);

	useEffect(() => {
		if (!isTypingSubscription.loading && isTypingSubscription.data) {
			if (
				selectedChat._id === isTypingSubscription.data.isTypingSub.senderId
			) {
				setTypingIndicator(
					isTypingSubscription.data.isTypingSub.isTyping
				);

				if (isTypingSubscription.data.isTypingSub.isTyping) {
					const sound = new Audio(typingPopAlert);
					sound.play();
				}
			}

		}

		return () => setTypingIndicator(false);
	}, [isTypingSubscription, selectedChat]);

	useEffect(() => {
		refetch();
	}, [selectedChat]);

	useEffect(() => {
		if (!loading) {
			setTimeout(() => {
				lastMessageRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'start',
				});
			}, 0);
		}
	}, [selectedChat, messages, loading]);

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
				// add shake animation flag
				newMessage.shake = true;

				// play new message notification sound
				const sound = new Audio(messagePopAlert);
				sound.play();

				setMessages([...messages, newMessage]);
				setTypingIndicator(false);
				return;
			}

			// if message sent to a non-selected chat add id to notifications array
			if (!selectedChat || newMessage.senderId._id !== selectedChat._id) {
				setNotifications([...notifications, newMessage.senderId._id]);
			}
		}
	}, [subscription]);

	return (
		<div className="px-4 flex-1 overflow-auto relative">
			{loading ? (
				[...Array(2)].map((_, index) => <MessageSkeleton key={index} />)
			) : messages.length === 0 ? (
				<p className="text-center">Send a message to start the chat</p>
			) : (
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} lastSeenByReceiver={selectedChat.lastSeenByReceiver} />
					</div>
				))
			)}

			<div className="sticky bottom-0 left-5">
				<TiMessageTyping
					size={typingIndicator ? 30 : 0}
					className={`text-lime-green transition-all ${
						typingIndicator
							? 'opacity-100 animate-bounce'
							: 'opacity-0'
					}`}
				/>
			</div>
		</div>
	);
};
export default Messages;
