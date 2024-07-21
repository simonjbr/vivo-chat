import { useState } from 'react';
import { SEND_MESSAGE } from '../utils/mutations';
import { useMutation } from '@apollo/client';
// import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import useChatStore from '../store/useChatStore';

const useSendMessage = ({ receiverId, content }) => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages } = useChatStore();
	// const { authUser } = useAuthContext();
	const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
		variables: {
			content,
			receiverId,
		},
	});

	const sendMessage = async () => {
		if (!content) {
			toast.error('Cannot send empty message');
			return false;
		}

		setLoading(true);
		try {
			const { data, error } = await sendMessageMutation(
				receiverId,
				content
			);

			if (error) {
				throw new Error(error);
			}

			setMessages([...messages, data.sendMessage]);

			console.log(messages);
		} catch (error) {
			toast.error(error);
			return false;
		} finally {
			setLoading(false);
		}
		return true;
	};

	return { loading, sendMessage };
};
export default useSendMessage;
