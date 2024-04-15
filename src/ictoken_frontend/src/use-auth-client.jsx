import { AuthClient } from '@dfinity/auth-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const defaultOptions = {
	/**
	 *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
	 */
	createOptions: {
		idleOptions: {
			// Set to true if you do not want idle functionality
			disableIdle: true,
		},
	},
	/**
	 * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
	 */
	loginOptions: {
		identityProvider:
			process.env.DFX_NETWORK === 'ic'
				? 'https://identity.ic0.app/#authorize'
				: `http://localhost:4943?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}#authorize`,
	},
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authClient, setAuthClient] = useState(null);
	const [identity, setIdentity] = useState(null);
	const [principal, setPrincipal] = useState(null);

	useEffect(() => {
		// Initialize AuthClient
		AuthClient.create(options.createOptions).then(async (client) => {
			updateClient(client);
		});
	}, []);

	const login = () => {
		authClient.login({
			...options.loginOptions,
			onSuccess: () => {
				updateClient(authClient);
			},
		});
	};

	async function updateClient(client) {
		const isAuthenticated = await client.isAuthenticated();
		setIsAuthenticated(isAuthenticated);

		const identity = client.getIdentity();
		setIdentity(identity);
		console.log('identity :', identity);

		const principal = identity.getPrincipal();

		// console.log('principal :', principal.toString());
		setPrincipal(principal);

		setAuthClient(client);
	}

	async function logout() {
		await authClient?.logout();
		await updateClient(authClient);
	}

	return {
		isAuthenticated,
		login,
		logout,
		authClient,
		identity,
		principal,
	};
};

/**
 * @type {React.FC}
 */
export const AuthProvider = ({ children }) => {
	const auth = useAuthClient();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
