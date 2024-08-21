import { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import useSendMessage from '../../hooks/useSendMessage';
import useChatStore from '../../store/useChatStore';
import { useMutation } from '@apollo/client';
import { IS_TYPING_MUTATION } from '../../utils/mutations';
import { useAuthContext } from '../../context/AuthContext';

const MessageInput = () => {
	const [messageInput, setMessageInput] = useState('');
	const { selectedChat } = useChatStore();

	const receiverId = selectedChat?._id;
	const { loading, sendMessage } = useSendMessage({
		receiverId,
		content: messageInput,
	});

	const { authUser } = useAuthContext();

	const [isTypingMutation] = useMutation(IS_TYPING_MUTATION);

	const handleInputChange = async (value) => {
		setMessageInput(value);

		if (messageInput.length === 0 && value.length > 0) {
			await isTypingMutation({
				variables: {
					senderId: authUser._id,
					receiverId: receiverId,
					isTyping: true,
				},
			});
		}

		if (messageInput.length > 0 && value.length === 0) {
			await isTypingMutation({
				variables: {
					senderId: authUser._id,
					receiverId: receiverId,
					isTyping: false,
				},
			});
		}
	};

	const handleMessageSubmit = async (e) => {
		e.preventDefault();

		const success = await sendMessage();

		if (success) {
			setMessageInput('');

			await isTypingMutation({
				variables: {
					senderId: authUser._id,
					receiverId: receiverId,
					isTyping: false,
				},
			});
		}
	};
	return (
		<form className="px-4 my-3" onSubmit={handleMessageSubmit}>
			<div className="w-full flex">
				<input
					type="text"
					name="messageInput"
					value={messageInput}
					onChange={(e) => handleInputChange(e.target.value)}
					className="border text-sm rounded-lg block w-full p-2.5 bg-new-slate focus:bg-rich-black"
				/>
				<button
					type="submit"
					className="inset-y-0 end-0 flex items-center ps-2"
					disabled={loading}
				>
					{loading ? (
						<span className="loading loading-spinner"></span>
					) : (
						<BiSend className="text-2xl text-mint-green cursor-pointer hover:text-lime-green" />
					)}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
