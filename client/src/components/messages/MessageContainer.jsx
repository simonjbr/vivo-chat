import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";


const MessageContainer = () => {
	const isChatSelected = false;

	return (
		<div className="md:min-w-[450px] flex flex-col">
			{isChatSelected ? (
				<>
				<div className="bg-tea-green px-4 py-2 mb-2">
					<span className="label-text text-new-slate">To:</span>{' '}
					<span className="text-rich-black font-bold">John Doe</span>
				</div>

				<Messages />
				<MessageInput />
			</>
			) : (
				<NoChatSelected />
			)}
			
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="px-4 text-center sm:text-lg md:text-xl text-mint-green font-semibold flex flex-col items-center gap-2">
				<p>Welcome John Doe</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className="text-3xl md:text-6xl text-center" />
			</div>
		</div>
	)
}
