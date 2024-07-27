import MessageContainer from '../../components/messages/MessageContainer';
import Sidebar from '../../components/sidebar/Sidebar';
import { OnlineUserContextProvider } from '../../context/OnlineUserContext.jsx';

const Home = () => {
	return (
		<OnlineUserContextProvider>
			<div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-steel-blue bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-15">
				<Sidebar />
				<MessageContainer />
			</div>
		</OnlineUserContextProvider>
	);
};
export default Home;
