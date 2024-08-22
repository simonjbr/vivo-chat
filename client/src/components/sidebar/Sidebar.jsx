import { createContext, useContext, useEffect, useState } from 'react';
import Chats from './Chats';
import LogoutButton from './LogoutButton';
// import SearchInput from './SearchInput';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useOnlineUserContext } from '../../context/OnlineUserContext';

const SidebarContext = createContext();

export const useSidebarContext = () => useContext(SidebarContext);

const Sidebar = () => {
	const [expanded, setExpanded] = useState(true);
	const {refetch} = useOnlineUserContext();

	useEffect(() => {
		refetch();
	}, [])

	return (
		<div className="border-r border-steel-blue p-4 flex flex-col">
			<SidebarContext.Provider value={{ expanded }}>
				{/* <SearchInput /> */}
				{/* {expanded ? <div className="divider px-3"></div> : ''} */}
				<div className="overflow-auto">
					<Chats />
				</div>
				<div className="flex flex-row justify-between mt-auto">
					<LogoutButton />
					<button onClick={() => setExpanded((current) => !current)}>
						{expanded ? (
							<FiChevronsLeft className="w-6 h-6 text-mint-green cursor-pointer hover:text-lime-green hover:text-shadow-sm" />
						) : (
							<FiChevronsRight className="w-6 h-6 text-mint-green cursor-pointer hover:text-lime-green hover:text-shadow-sm" />
						)}
					</button>
				</div>
			</SidebarContext.Provider>
		</div>
	);
};
export default Sidebar;
