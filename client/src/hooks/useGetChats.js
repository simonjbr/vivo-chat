import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { USERS } from '../utils/queries';
import toast from 'react-hot-toast';

const useGetChats = () => {
	const [loading, setLoading] = useState(false);
	const [chats, setChats] = useState([]);
	const { error, data } = useQuery(USERS);

	useEffect(() => {
		const getChats = async () => {
			setLoading(true);

			try {
				// const { data, error } = await useQuery(USERS);

				if (error) {
					throw new Error(error);
				}

				setChats(data.users);
				console.log(data);
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
