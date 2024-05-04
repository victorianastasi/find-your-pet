import React, { createContext, useContext, useEffect, useState } from 'react';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { auth, db, getUsersDb } from '../firebase';
import { User } from '../components/models';

const AuthContext = createContext<any | null>(null);

// User data type interface
export interface UserType {
	email: string | null;
	uid: string | null;
	displayName: string | null;
}

export const AuthContextProvider = ({children,}: {children: React.ReactNode;}) => {
	const [user, setUser] = useState<UserType>({ email: null, uid: null, displayName: null });
	const [userDB, setUserDB] = useState<User>({ email: '', phone: '', userName: '', id: '' });
	const [loading, setLoading] = useState<Boolean>(true);
	  
	  useEffect(() => {
		const fetchUserData = async () => {
		  try {	  
			const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
			  if (userAuth) {
				setUser({
				  email: userAuth.email,
				  uid: userAuth.uid,
				  displayName: userAuth.displayName
				});
	
				// Esperar a que getUsersDb se complete y obtener los datos actualizados
				const updatedUsersDbAuth = await getUsersDb(db);
				console.log("updatedUsersDbAuth", updatedUsersDbAuth);
				if (userAuth.email !== '' && updatedUsersDbAuth) {
				  const foundUser = updatedUsersDbAuth.find((userData) => userData.id === userAuth.uid);
				  console.log("foundUser", foundUser);
				  if (foundUser) {
					setUserDB({ email: foundUser.email, phone: foundUser.phone, id: foundUser.id, userName: foundUser.userName });
				  }
				}
			  } else {
				setUser({ email: null, uid: null, displayName: null });
			  }
			  setLoading(false);
			});
	  
			return () => unsubscribe();
		  } catch (error) {
			console.error('Error fetching user data:', error);
		  }
		};
	  
		fetchUserData();
	  
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
		<AuthContext.Provider value={{ user, signUpFunction, logInFunction, logOut, userDB }}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
}
