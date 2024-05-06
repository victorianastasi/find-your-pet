import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, getUsersDb } from "../firebase";
import { User } from "../components/models";

const AuthContext = createContext<any | null>(null);

// User data type interface
export interface UserType {
  email: string | null;
  uid: string | null;
  displayName: string | null;
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType>({
    email: null,
    uid: null,
    displayName: null,
  });
  const [userDB, setUserDB] = useState<User>({
    email: "",
    phone: "",
    userName: "",
    id: "",
  });
  const [loading, setLoading] = useState<Boolean>(true);
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeout = 30 * 60 * 1000; //30 minutos
  const isScrolling = useRef<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
          if (userAuth) {
            setUser({
              email: userAuth.email,
              uid: userAuth.uid,
              displayName: userAuth.displayName,
            });

            // Esperar a que getUsersDb se complete y obtener los datos actualizados
            const updatedUsersDbAuth = await getUsersDb(db);
            console.log("updatedUsersDbAuth", updatedUsersDbAuth);
            if (userAuth.email !== "" && updatedUsersDbAuth) {
              const foundUser = updatedUsersDbAuth.find(
                (userData) => userData.id === userAuth.uid
              );
              console.log("foundUser", foundUser);
              if (foundUser) {
                setUserDB({
                  email: foundUser.email,
                  phone: foundUser.phone,
                  id: foundUser.id,
                  userName: foundUser.userName,
                });

                const activityHandler = () => {
                  if (isScrolling.current) {
                    return;
                  }
                  if (logoutTimer.current !== null) {
                    clearTimeout(logoutTimer.current);
                  }
                  logoutTimer.current = setTimeout(() => {
                    signOut(auth);
                    setUser({ email: null, uid: null, displayName: null });
                  }, inactivityTimeout);
                };

                // actividad de eventos que indican actividad del usuario
                document.addEventListener("click", activityHandler);
                document.addEventListener("mousemove", activityHandler);
                document.addEventListener("keydown", activityHandler);
                window.addEventListener("scroll", () => {
                  isScrolling.current = true;
                  setTimeout(() => {
                    isScrolling.current = false;
                  }, 100);
                });

                return () => {
                  if (logoutTimer.current !== null) {
                    clearTimeout(logoutTimer.current);
                  }
                  document.removeEventListener("click", activityHandler);
                  document.removeEventListener("mousemove", activityHandler);
                  document.removeEventListener("keydown", activityHandler);
                  window.removeEventListener("scroll", () => {
                    isScrolling.current = true;
                    setTimeout(() => {
                      isScrolling.current = false;
                    }, 100);
                  });
                };
              }
            }
          } else {
            setUser({ email: null, uid: null, displayName: null });
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [inactivityTimeout]);

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
    if (logoutTimer.current !== null) {
      clearTimeout(logoutTimer.current);
    }
    setUser({ email: null, uid: null, displayName: null });
    return await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, signUpFunction, logInFunction, logOut, userDB }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
