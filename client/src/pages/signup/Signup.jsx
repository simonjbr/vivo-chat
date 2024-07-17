import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
	const [username, setUsername] = useState('');
	const [avatar, setAvatar] = useState('');

	const handleUsernameBlur = (e) => {
		setUsername(e.target.value);
	};

	const handleAvatarChange = (e) => {
		setAvatar(e.target.value);
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

				<form>
					<div>
						<label className="label p-2">
							<span className="text-base label-text text-tea-green">
								Username
							</span>
						</label>
						<input
							type="text"
							name="username"
							value={username}
							onChange={handleUsernameBlur}
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
							placeholder="Enter Password"
							className="w-full input input-bordered h-10 bg-rich-black text-tea-green"
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
							placeholder="Confirm Password"
							className="w-full input input-bordered h-10 bg-rich-black text-tea-green"
						/>
					</div>
					<div>
						<label className="label">
							<span className="text-base label-text text-tea-green">
								Robot Picker
							</span>
						</label>
						<select
							className="w-full select select-bordered h-10 bg-rich-black"
							value={avatar}
							onChange={handleAvatarChange}
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
										username.length > 0
											? `https://robohash.org/${username}?set=set${avatar}`
											: `https://robohash.org/125.253.50.25.png?set=set${avatar}`
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
						<button className="btn btn-block btn-sm text-tea-green bg-rich-black mt-2 hover:bg-new-slate">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Signup;
