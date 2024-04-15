import React from 'react';
import { useAuth } from '../use-auth-client';
import { Link } from 'react-router-dom';

const Login = () => {
	const { isAuthenticated, login, principal, logout } = useAuth();
	return (
		<div className="h-screen flex flex-col place-items-center justify-center w-full">
			<h1 className="text-3xl font-bold my-10">Login page</h1>
			<div className="flex place-items-center justify-center w-full">
				{isAuthenticated ? (
					<div>
						<Link to={'home'}>Home</Link>
						<>
							<h1>Hello {principal.toString()}</h1>
							<button onClick={() => logout()}>Logout</button>
						</>
					</div>
				) : (
					<>
						<button
							className="bg-green-500 text-white px-4 rounded-md"
							onClick={login}
						>
							Log in
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Login;
