import { useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/AuthContext';
import useChatStore from '../../store/useChatStore';
import { CHAT } from '../../utils/queries';
import { CREATE_CHAT } from '../../utils/mutations';
import { useOnlineUserContext } from '../../context/OnlineUserContext';

const Chat = ({ chat, lastIndex }) => {
	const { selectedChat, setSelectedChat } = useChatStore();
	const { authUser } = useAuthContext();
	const isSelected = selectedChat?._id === chat._id;
	const { data, error } = useQuery(CHAT, {
		variables: {
			participantOne: authUser._id,
			participantTwo: chat._id,
		},
	});
	const [createChat] = useMutation(CREATE_CHAT, {
		refetchQueries: [CHAT, 'Chat'],
	});
	const { onlineUsers } = useOnlineUserContext();

	const isOnline = onlineUsers.includes(chat._id);

	const handleChatSelect = async () => {
		setSelectedChat(chat);
		if (data) {
			return;
		}
		if (error && error.message.toString() === 'No such chat exists') {
			const { error: createError } = await createChat({
				variables: {
					participantOne: authUser._id,
					participantTwo: chat._id,
				},
			});
			if (createError) {
				console.log(createError.message);
			}
		}
	};

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-rich-black rounded p-2 py-1 cursor-pointer ${
					isSelected ? 'bg-rich-black' : ''
				}`}
				onClick={handleChatSelect}
			>
				<div className={`avatar ${isOnline ? 'online' : ''}`}>
					<div className="w-12 rounded-full">
						<img src={chat.avatar} alt="user avatar" />
					</div>
				</div>

				<div className="flex flex-col flex-1">
					<div className="flex gap-3 justify-between">
						<p className="font-bold text-mint-green">
							{chat.username}
						</p>
						<span className="text-xl">{':]'}</span>
					</div>
				</div>
			</div>

			{lastIndex ? '' : <div className="divider my-0 py-0 h-1" />}
		</>
	);
};
export default Chat;
