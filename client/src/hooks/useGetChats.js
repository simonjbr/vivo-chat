import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { USERS } from '../utils/queries';
import toast from 'react-hot-toast';

const useGetChats = () => {
	const [loading, setLoading] = useState(false);
	const [chats, setChats] = useState([]);
	const { error, data, loading: loadingQuery } = useQuery(USERS);

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
				console.log(data);

				setChats(data?.users || []);
			} catch (error) {
				toast.error(error);
			} finally {
				setLoading(false);
			}
		};

		getChats();
		
	}, [data]);

	return { loading, chats };
};

export default useGetChats;
