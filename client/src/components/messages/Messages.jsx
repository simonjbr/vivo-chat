import { useMutation, useQuery } from '@apollo/client';
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
import { TiMessages, TiMessageTyping } from 'react-icons/ti';
import { UPDATE_LAST_SEEN } from '../../utils/mutations';

const Messages = () => {
	const { selectedChat } = useChatStore();
	const { authUser } = useAuthContext();
	const { data, error, loading, refetch } = useQuery(CHAT, {
		variables: {
			participantOne: authUser._id,
			participantTwo: selectedChat?._id,
		},
	});
	const [messages, setMessages] = useState([]);
	const lastMessageRef = useRef();
	const { notifications, setNotifications } = useNotificationContext();
	const [chat, setChat] = useState(null);
	const lastSeenByReceiver =
		authUser._id === chat?.participantOne._id
			? chat?.lastSeenByTwo
			: chat?.lastSeenByOne;

	const subscription = useSubscription(NEW_MESSAGE, {
		variables: {
			authUserId: authUser._id,
			// selectedChatId: selectedChat?._id,
		},
	});

	const [typingIndicator, setTypingIndicator] = useState(false);
	const isTypingSubscription = useSubscription(IS_TYPING_SUB);

	const [updateLastSeen] = useMutation(UPDATE_LAST_SEEN);

	useEffect(() => {
		if (!isTypingSubscription.loading && isTypingSubscription.data) {
			if (
				selectedChat?._id ===
				isTypingSubscription.data.isTypingSub.senderId
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
			setChat(data.chat);
		}
	}, [data, error]);

	useEffect(() => {
		if (!subscription.loading && subscription.data) {
			const newMessage = subscription.data.newMessage;

			if (
				newMessage.senderId._id === selectedChat?._id ||
				newMessage.receiverId._id === selectedChat?._id
			) {
				// add shake animation flag
				newMessage.shake = true;

				// play new message notification sound
				const sound = new Audio(messagePopAlert);
				sound.play();

				setMessages([...messages, newMessage]);
				setTypingIndicator(false);

				// update lastSeenBy
				updateLastSeen({
					variables: {
						selectedChatId: selectedChat._id,
					},
				});
				return;
			}

			// if message sent to a non-selected chat add id to notifications array
			if (
				!selectedChat ||
				newMessage.senderId._id !== selectedChat?._id
			) {
				setNotifications([...notifications, newMessage.senderId._id]);
			}
		}
	}, [subscription]);

	return (
		<>
			{selectedChat ? (
				<div className="bg-tea-green px-4 py-2 mb-2">
					<span className="label-text text-new-slate">To:</span>{' '}
					<span className="text-rich-black font-bold">
						{selectedChat?.username}
					</span>
				</div>
			) : (
				<NoChatSelected />
			)}

			<div className="px-4 flex-1 overflow-auto relative">
				{loading ? (
					[...Array(2)].map((_, index) => (
						<MessageSkeleton key={index} />
					))
				) : messages.length === 0 ? (
					<p className="text-center">
						Send a message to start the chat
					</p>
				) : (
					messages.map((message) => (
						<div key={message._id} ref={lastMessageRef}>
							<Message
								message={message}
								lastSeenByReceiver={lastSeenByReceiver}
							/>
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
		</>
	);
};
export default Messages;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="px-4 text-center sm:text-lg md:text-xl text-mint-green font-semibold flex flex-col items-center gap-2">
				<p>Welcome {authUser.username}</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className="text-3xl md:text-6xl text-center" />
			</div>
		</div>
	);
};
