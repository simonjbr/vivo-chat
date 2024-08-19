import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useGetChats from '../../hooks/useGetChats';
import toast from 'react-hot-toast';
import useChatStore from '../../store/useChatStore';
import { useAuthContext } from '../../context/AuthContext';
import { useSidebarContext } from './Sidebar';

const SearchInput = () => {
	const [searchInput, setSearchInput] = useState('');
	const { chats } = useGetChats();
	const { setSelectedChat } = useChatStore();
	const { authUser } = useAuthContext();

	const { expanded } = useSidebarContext();

	const handleSearchSubmit = (e) => {
		e.preventDefault();

		if (!searchInput) {
			toast.error('Please provide a search term');
			return;
		}

		if (searchInput.length < 3) {
			toast.error('Search term must be at least 3 characters long');
			return;
		}

		const filteredChats = chats.filter((chat) => chat._id !== authUser._id);

		const searchResult = filteredChats.find((chat) =>
			chat.username.toLowerCase().includes(searchInput.toLowerCase())
		);

		if (searchResult) {
			setSelectedChat(searchResult);
			setSearchInput('');
		} else {
			toast.error('Could not find a user');
		}
	};

	return (
		<form
			onSubmit={handleSearchSubmit}
			className={`flex items-center gap-2 ${expanded ? '' : 'hidden'}`}
		>
			<input
				type="text"
				name="searchInput"
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
				placeholder="Search..."
				className="input input-bordered rounded-full bg-new-slate focus:bg-rich-black"
			/>
			<button
				type="submit"
				className="btn btn-circle bg-lime-green text-rich-black hover:bg-tea-green"
			>
				<FaSearch className="w-6 h-6 outline-none" />
			</button>
		</form>
	);
};
export default SearchInput;
