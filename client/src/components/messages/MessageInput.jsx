import { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import useSendMessage from '../../hooks/useSendMessage';
import useChatStore from '../../store/useChatStore';

const MessageInput = () => {
	const [messageInput, setMessageInput] = useState('');
	const { selectedChat } = useChatStore();

	const receiverId = selectedChat?._id;
	const { loading, sendMessage } = useSendMessage({
		receiverId,
		content: messageInput,
	});

	const handleMessageSubmit = async (e) => {
		e.preventDefault();

		const success = await sendMessage();

		if (success) {
			setMessageInput('');
		}
	};
	return (
		<form className="px-4 my-3" onSubmit={handleMessageSubmit}>
			<div className="w-full flex">
				<input
					type="text"
					name="messageInput"
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
					className="border text-sm rounded-lg block w-full p-2.5 bg-new-slate focus:bg-rich-black"
				/>
				<button
					type="submit"
					className="inset-y-0 end-0 flex items-center ps-2"
					disabled={loading}
				>
					{loading ? <span className='loading loading-spinner'></span> : <BiSend className="text-2xl text-mint-green cursor-pointer hover:text-lime-green" />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
