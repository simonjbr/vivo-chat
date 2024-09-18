import dayjs from 'dayjs';
import { useAuthContext } from '../../context/AuthContext';
import { TiTick, TiTickOutline } from "react-icons/ti";


const Message = ({ message, lastSeenByReceiver }) => {
	const { authUser } = useAuthContext();
	const formattedTimestamp = dayjs
		.unix(message.createdAt / 1000)
		.format('hh:mm a');
	const isFromMe = message.senderId._id === authUser._id;

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
				{message.createdAt > lastSeenByReceiver ? <TiTickOutline /> : <TiTick className='text-lime-green' />}
			</div>
		</div>
	);
};
export default Message;
