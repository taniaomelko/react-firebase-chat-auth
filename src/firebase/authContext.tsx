import React, { useState, useEffect, useContext, ReactNode } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthContextProps {
  currentUser: any;
  userLoggedIn: boolean;
  loading: boolean;
  setUser: (user: any) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const initialUser = {
  currentUser: {},
  userLoggedIn: false,
  loading: false,
  setUser: () => {},
}

const AuthContext = React.createContext<AuthContextProps>(initialUser);

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function initializeUser(user: any) {
      console.log(user);
      
      if (user) {
        setCurrentUser(user);
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const setUser = (user: any) => {
    setCurrentUser(user);
    setUserLoggedIn(!!user);
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
