import { useState } from 'react';
import { Link } from 'react-router-dom';
import useSignup from '../../hooks/useSignup';
import { useAuthContext } from '../../context/AuthContext';

const Signup = () => {
	const [formInputs, setFormInputs] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		avatar: 1,
	});

	const { loading, signup } = useSignup(formInputs);
	const { authUser } = useAuthContext();

	if (authUser) {
		console.log(authUser._id);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === 'avatar') {
			setFormInputs({
				...formInputs,
				avatar: parseInt(value),
			});
		} else {
			setFormInputs({
				...formInputs,
				[name]: value,
			});
		}
	};

	const handleSignupSubmit = async (e) => {
		e.preventDefault();

		await signup();

		// reset form
		setFormInputs({
			username: '',
			password: '',
			confirmPassword: '',
			avatar: 1,
		});
	};

	return (
		<div className="flex flex-col items-center justify-center min-w-96 mx-auto">
			<div className="w-full p-6 rounded-lg shadow-xl bg-steel-blue bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-15">
				<h1 className="text-3xl font-semibold text-center text-tea-green">
					Signup
					<span className="text-lime-greener font-light italic text-shadow">
						{' '}
						vivo
					</span>
					<span className="text-lime-green font-teko text-4xl">
						Chat
					</span>
				</h1>

				<form onSubmit={handleSignupSubmit}>
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
							className="w-full input input-bordered h-10 bg-new-slate focus:bg-rich-black text-tea-green"
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
							className="w-full input input-bordered h-10 bg-new-slate focus:bg-rich-black text-tea-green"
						/>
					</div>
					<div>
						<label className="label">
							<span className="text-base label-text text-tea-green">
								Confirm Password
							</span>
						</label>
						<input
							type="password"
							name="confirmPassword"
							value={formInputs.confirmPassword}
							onChange={handleInputChange}
							placeholder="Confirm Password"
							className="w-full input input-bordered h-10 bg-new-slate focus:bg-rich-black text-tea-green"
						/>
					</div>
					<div>
						<label className="label">
							<span className="text-base label-text text-tea-green">
								Robot Picker
							</span>
						</label>
						<select
							name="avatar"
							value={formInputs.avatar}
							onChange={handleInputChange}
							className="w-full select select-bordered h-10 bg-new-slate focus:bg-rich-black"
						>
							<option value={1}>Robot #1</option>
							<option value={2}>Monster</option>
							<option value={3}>Robot #2</option>
							<option value={4}>Cat</option>
							<option value={5}>Human</option>
						</select>
					</div>
					<div className="flex flex-col items-center justify-center mt-2">
						<div className="avatar">
							<div className="w-24 rounded">
								<img
									src={
										formInputs.username.length > 0
											? `https://robohash.org/${formInputs.username}?set=set${formInputs.avatar}`
											: `https://robohash.org/125.253.50.25.png?set=set${formInputs.avatar}`
									}
								/>
							</div>
						</div>
					</div>
					<Link
						to="/login"
						className="text-sm text-tea-green hover:underline hover:text-steel-blue mt-2 inline-block"
					>
						Already have an account?
					</Link>
					<div>
						<button
							className="btn btn-block btn-sm text-tea-green bg-rich-black mt-2 hover:bg-new-slate"
							disabled={loading}
						>
							{loading ? (
								<span className="loading loading-spinner"></span>
							) : (
								'Signup'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Signup;
