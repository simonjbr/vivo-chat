import dayjs from 'dayjs';
import { useAuthContext } from '../../context/AuthContext';

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const formattedTimestamp = dayjs
		.unix(message.createdAt / 1000)
		.format('hh:mm a');
	const isFromMe = message.senderId._id === authUser._id;

	console.log(authUser);
	return (
		<div className={`chat ${isFromMe ? 'chat-end' : 'chat-start'}`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img src={message.senderId.avatar} alt="user avatar" />
				</div>
			</div>
			<div className={`chat-bubble text-white ${isFromMe ? 'bg-steel-blue' : 'bg-new-slate'}`}>
				{message.content}
			</div>
			<div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
				{formattedTimestamp}
			</div>
		</div>
	);
};
export default Message;
