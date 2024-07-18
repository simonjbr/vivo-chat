import { BiLogOut } from 'react-icons/bi';
import useLogout from '../../hooks/useLogout';

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="mt-auto">
			{loading ? (
				<span className="loading loading-spinner"></span>
			) : (
				<BiLogOut
					onClick={handleLogout}
					className="w-6 h-6 text-mint-green cursor-pointer hover:text-lime-green hover:text-shadow-sm"
				/>
			)}
		</div>
	);
};
export default LogoutButton;
