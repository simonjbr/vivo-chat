const Login = () => {
	return (
		<div className="flex flex-col items-center justify-center min-w-96 mx-auto">
			<div className="w-full p-6 rounded-lg shadow-xl bg-steel-blue bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-15">
				<h1 className="text-3xl font-semibold text-center text-tea-green">
					Login
					<span className="text-lime-greener"> vivoChat</span>
				</h1>

				<form className="">
					<div>
						<label className="label p-2">
							<span className="text-base label-text text-tea-green">
								Username
							</span>
						</label>
						<input
							type="text"
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
					<a
						href=""
						className="text-sm text-tea-green hover:underline hover:text-steel-blue mt-2 inline-block"
					>
						{"Don't"} have an account?
					</a>
					<div>
						<button className="btn btn-block btn-sm text-tea-green bg-rich-black mt-2 hover:bg-new-slate">Login</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
