import useChatStore from '../../store/useChatStore';
import { useOnlineUserContext } from '../../context/OnlineUserContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { useEffect } from 'react';
import { useSidebarContext } from './Sidebar';
// import { useAuthContext } from '../../context/AuthContext';

const Chat = ({ user, lastIndex }) => {
	const { selectedChat, setSelectedChat } = useChatStore();
	// const { authUser } = useAuthContext();
	const { onlineUsers } = useOnlineUserContext();
	// const isParticipantOne = chat.participantOne._id === authUser._id;
	// const participant = isParticipantOne
	// 	? chat.participantTwo
	// 	: chat.participantOne;
	// const lastSeenByReceiver = isParticipantOne
	// 	? chat.lastSeenByTwo
	// 	: chat.lastSeenByOne;
	// const lastSeenByUser = isParticipantOne
	// 	? chat.lastSeenByOne
	// 	: chat.lastSeenByTwo;
	// const chatId = participant._id;

	const isSelected = selectedChat?._id === user._id;

	const isOnline = onlineUsers.includes(user._id);

	const { notifications, setNotifications } = useNotificationContext();
	// check notification context first
	let hasNotification = notifications.includes(user._id);
	// if none in notification context check if last seen by data reveals unread messages
	// if (!hasNotification) {
	// 	// if last mesage is not from authUser and createdAt is newer than lastSeenByUser it hasNotification
	// 	hasNotification = chat.messages.at(-1)?.senderId._id !== authUser._id && lastSeenByUser < chat.messages.at(-1)?.createdAt;
	// }

	const { expanded } = useSidebarContext();

	useEffect(() => {
		// if chat with notification is selected remove from the notifications array
		if (hasNotification && selectedChat?._id === user._id) {
			const nextNotifications = notifications.filter(
				(notification) => notification !== selectedChat._id
			);
			setNotifications(nextNotifications);
		}
	}, [selectedChat]);

	const handleChatSelect = async () => {
		setSelectedChat({
			...user,
			// lastSeenByReceiver,
		});
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
								user.avatar
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
								user.username
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
