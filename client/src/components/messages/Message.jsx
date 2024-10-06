import dayjs from 'dayjs';
import { useAuthContext } from '../../context/AuthContext';
import { TiTick, TiTickOutline } from 'react-icons/ti';
import { useEffect, useState } from 'react';

const Message = ({ message, lastSeenByReceiver, lastSeenUpdatedSub }) => {
	const { authUser } = useAuthContext();
	const [isRead, setIsRead] = useState(
		message.createdAt < lastSeenByReceiver
	);
	const formattedTimestamp = dayjs
		.unix(message.createdAt / 1000)
		.format('hh:mm a');
	const isFromMe = message.senderId._id === authUser._id;

	useEffect(() => {
		if (!lastSeenUpdatedSub.loading && lastSeenUpdatedSub.data) {
			setIsRead(
				message.createdAt <
					lastSeenUpdatedSub.data.lastSeenUpdatedSub.lastSeen
			);
		}
	}, [lastSeenUpdatedSub.data?.lastSeenUpdatedSub.lastSeen]);

	return (
		<div className={`chat ${isFromMe ? 'chat-end' : 'chat-start'}`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img src={message.senderId.avatar} alt="user avatar" />
				</div>
			</div>
			<div
				className={`chat-bubble max-w-72 shadow-sm text-white ${
					isFromMe ? 'bg-steel-blue' : 'bg-new-slate'
				} ${message.shake ? 'shake' : ''}`}
			>
				{message.content}
			</div>
			<div className="chat-footer opacity-50 text-platinum text-xs flex gap-1 items-center">
				{formattedTimestamp}
				{!isFromMe ? (
					''
				) : isRead ? (
					<TiTick className="text-lime-green" />
				) : (
					<TiTickOutline />
				)}
			</div>
		</div>
	);
};
export default Message;
