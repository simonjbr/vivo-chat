import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
	return (
		<form className="flex items-center gap-2">
			<input
				type="text"
				placeholder="Search..."
				className="input input-bordered rounded-full bg-new-slate focus:bg-rich-black"
			/>
			<button type="submit" className="btn btn-circle bg-lime-green text-rich-black hover:bg-tea-green">
				<FaSearch className="w-6 h-6 outline-none" />
			</button>
		</form>
	);
};
export default SearchInput;
