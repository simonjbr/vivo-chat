import useChatStore from '../../store/useChatStore';

const Chat = ({ chat, lastIndex }) => {
	const { selectedChat, setSelectedChat } = useChatStore();

	const isSelected = selectedChat?._id === chat._id;

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-rich-black rounded p-2 py-1 cursor-pointer ${
					isSelected ? 'bg-rich-black' : ''
				}`}
				onClick={() => setSelectedChat(chat)}
			>
				<div className="avatar online">
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
