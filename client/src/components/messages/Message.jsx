const Message = () => {
	return (
		<div className="chat chat-end">
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img
						src="https://robohash.org/125.253.50.25.png?set=set1"
						alt="user avatar"
					/>
				</div>
			</div>
			<div className="chat-bubble text-white bg-steel-blue">
				Hi! What is upp?
			</div>
			<div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
				12:42
			</div>
		</div>
	);
};
export default Message;
