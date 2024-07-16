import { BiSend } from 'react-icons/bi';

const MessageInput = () => {
	return (
		<form className="px-4 my-3">
			<div className="w-full flex">
				<input
					type="text"
					className="border text-sm rounded-lg block w-full p-2.5 bg-new-slate focus:bg-rich-black"
				/>
				<button
					type="submit"
					className="inset-y-0 end-0 flex items-center ps-2"
				>
					<BiSend className='text-2xl text-mint-green cursor-pointer hover:text-lime-green' />
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
