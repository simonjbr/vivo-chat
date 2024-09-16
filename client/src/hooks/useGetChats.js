import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { CHATS } from '../utils/queries';
import toast from 'react-hot-toast';
import { SIGNED_UP } from '../utils/subscriptions';

const useGetChats = () => {
	const [loading, setLoading] = useState(false);
	const [chats, setChats] = useState([]);
	const {
		error,
		data,
		loading: loadingQuery,
		subscribeToMore,
	} = useQuery(CHATS);

	useEffect(() => {
		const getChats = () => {
			setLoading(true);

			if (loadingQuery || error) {
				setChats([]);
				return;
			}

			try {
				if (error) {
					throw new Error(error);
				}

				setChats(data?.chats || []);
			} catch (error) {
				toast.error(error);
			} finally {
				setLoading(false);
			}
		};

		getChats();
	}, [data]);

	// subscribe to any new users
	useEffect(() => {
		subscribeToMore({
			document: SIGNED_UP,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const signedUpUser = subscriptionData.data.signedUp;

				// if matching id found return unchanged data
				const matchingUserIds = prev.users.filter(
					(user) => user._id === signedUpUser._id
				);
				if (matchingUserIds.length > 0) return prev;

				return {
					...prev,
					users: [...prev.users, signedUpUser],
				};
			},
		});
	}, []);

	return { loading, chats };
};

export default useGetChats;
