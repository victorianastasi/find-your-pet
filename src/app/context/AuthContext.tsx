import React, { createContext, useContext, useEffect, useState } from 'react';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext<any | null>(null);

// User data type interface
export interface UserType {
	email: string | null;
	uid: string | null;
	displayName: string | null;
}

export const AuthContextProvider = ({children,}: {children: React.ReactNode;}) => {
	// Define the constants for the user and loading state
	const [user, setUser] = useState<UserType>({ email: null, uid: null, displayName: null });
	const [loading, setLoading] = useState<Boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser({
					email: user.email,
					uid: user.uid,
					displayName: user.displayName
				});
			} else {
				setUser({ email: null, uid: null, displayName: null });
			}
		});

		setLoading(false);

		return () => unsubscribe();
	}, []);

	// Sign up the user
	const signUpFunction = (email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	// Login the user
	const logInFunction = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	// Logout the user
	const logOut = async () => {
		setUser({ email: null, uid: null, displayName: null });
		return await signOut(auth);
	};

	return (
		<AuthContext.Provider value={{ user, signUpFunction, logInFunction, logOut }}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
}
