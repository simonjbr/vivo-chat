import MessageContainer from '../../components/messages/MessageContainer';
import Sidebar from '../../components/sidebar/Sidebar';

const Home = () => {
	return (
		<div className="flex h-[90vh] max-lg:w-[90vw] lg:w-[1000px] rounded-lg overflow-hidden bg-steel-blue bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-15">
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
