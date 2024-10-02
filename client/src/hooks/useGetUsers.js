import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { USERS } from '../utils/queries';
import toast from 'react-hot-toast';
import { SIGNED_UP } from '../utils/subscriptions';

const useGetUsers = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const {
		error,
		data,
		loading: loadingQuery,
		subscribeToMore,
	} = useQuery(USERS);

	useEffect(() => {
		const getUsers = () => {
			setLoading(true);

			if (loadingQuery || error) {
				setUsers([]);
				return;
			}

			try {
				if (error) {
					throw new Error(error);
				}

				setUsers(data?.users || []);
			} catch (error) {
				toast.error(error);
			} finally {
				setLoading(false);
			}
		};

		getUsers();
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

	return { loading, users };
};

export default useGetUsers;
