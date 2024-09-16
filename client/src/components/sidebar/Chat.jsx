import useChatStore from '../../store/useChatStore';
import { useOnlineUserContext } from '../../context/OnlineUserContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { useEffect } from 'react';
import { useSidebarContext } from './Sidebar';
import { useAuthContext } from '../../context/AuthContext';

const Chat = ({ chat, lastIndex }) => {
	const { selectedChat, setSelectedChat } = useChatStore();
	const { authUser } = useAuthContext();
	const { onlineUsers } = useOnlineUserContext();
	// const isParticipantOne = chat.participantOne._id === authUser._id;
	const participant =
		chat.participantOne._id === authUser._id
			? chat.participantTwo
			: chat.participantOne;
	// const chatId = isParticipantOne
	// 	? chat.participantTwo._id
	// 	: chat.participantOne._id;
	const chatId = participant._id;

	const isSelected = selectedChat?._id === chatId;

	const isOnline = onlineUsers.includes(chatId);

	const { notifications, setNotifications } = useNotificationContext();
	const hasNotification = notifications.includes(chatId);

	const { expanded } = useSidebarContext();

	useEffect(() => {
		// if chat with notification is selected remove from the notifications array
		if (hasNotification && selectedChat._id === chatId) {
			const nextNotifications = notifications.filter(
				(notification) => notification !== selectedChat._id
			);
			setNotifications(nextNotifications);
		}
	}, [selectedChat]);

	const handleChatSelect = async () => {
		// isParticipantOne
		// 	? setSelectedChat(chat.participantTwo)
		// 	: setSelectedChat(chat.participantOne);
		setSelectedChat(participant);
	};

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-rich-black rounded p-2 py-1 cursor-pointer ${
					isSelected ? 'bg-rich-black' : ''
				} ${
					hasNotification
						? 'bg-steel-blue border-2 border-lime-green'
						: ''
				}`}
				onClick={handleChatSelect}
			>
				<div className={`avatar ${isOnline ? 'online' : ''}`}>
					<div className="w-12 rounded-full">
						<img
							src={
								// isParticipantOne
								// 	? chat.participantTwo.avatar
								// 	: chat.participantOne.avatar
								participant.avatar
							}
							alt="user avatar"
						/>
					</div>
				</div>

				<div
					className={`flex flex-col flex-1 ${
						expanded ? '' : 'hidden'
					}`}
				>
					<div className="flex gap-3 justify-between">
						<p className="font-bold text-mint-green">
							{
								// isParticipantOne
								// 	? chat.participantTwo.username
								// 	: chat.participantOne.username
								participant.username
							}
						</p>
						<span className="text-xl">
							{hasNotification ? '!!!!!' : ':]'}
						</span>
					</div>
				</div>
			</div>

			{lastIndex ? '' : <div className="divider my-0 py-0 h-1" />}
		</>
	);
};
export default Chat;
