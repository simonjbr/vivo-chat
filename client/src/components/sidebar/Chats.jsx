import useGetChats from '../../hooks/useGetChats';
import Chat from './Chat';

const Chats = () => {
	const { loading, chats } = useGetChats();
	console.log(chats);

	return (
		<div className="py-2 flex flex-col overflow-auto">
			{loading ? (
				<span className="loading loading-spinner mx-auto"></span>
			) : (
				chats.map((chat, index) => (
					<Chat
						key={chat._id}
						chat={chat}
						lastIndex={index === chats.length - 1}
					/>
				))
			)}
		</div>
	);
};

export default Chats;
