import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const Login = () => {
	const [formInputs, setFormInputs] = useState({
		username: '',
		password: '',
	});
	const { loading, login } = useLogin(formInputs);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormInputs({
			...formInputs,
			[name]: value,
		});
	};

	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		const success = await login(formInputs);

		if (success) {
			setFormInputs({
				username: '',
				password: '',
			});
		}
	};
	return (
		<div className="flex flex-col items-center justify-center min-w-96 mx-auto">
			<div className="w-full p-6 rounded-lg shadow-xl bg-steel-blue bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-15">
				<h1 className="text-3xl font-semibold text-center text-tea-green">
					Login
					<span className="text-lime-greener font-light italic text-shadow">
						{' '}
						vivo
					</span>
					<span className="text-lime-green font-teko text-4xl">
						Chat
					</span>
				</h1>

				<form onSubmit={handleLoginSubmit}>
					<div>
						<label className="label p-2">
							<span className="text-base label-text text-tea-green">
								Username
							</span>
						</label>
						<input
							type="text"
							name="username"
							value={formInputs.username}
							onChange={handleInputChange}
							placeholder="Enter Username"
							className="w-full input input-bordered h-10 bg-rich-black text-tea-green"
						/>
					</div>
					<div>
						<label className="label">
							<span className="text-base label-text text-tea-green">
								Password
							</span>
						</label>
						<input
							type="password"
							name="password"
							value={formInputs.password}
							onChange={handleInputChange}
							placeholder="Enter Password"
							className="w-full input input-bordered h-10 bg-rich-black text-tea-green"
						/>
					</div>
					<Link
						to="/signup"
						className="text-sm text-tea-green hover:underline hover:text-steel-blue mt-2 inline-block"
					>
						{"Don't"} have an account?
					</Link>
					<div>
						<button
							className="btn btn-block btn-sm text-tea-green bg-rich-black mt-2 hover:bg-new-slate"
							disabled={loading}
						>
							{loading ? (
								<span className="loading loading-spinner"></span>
							) : (
								'Login'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
