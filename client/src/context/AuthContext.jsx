import { createContext, useState, useEffect } from "react";
import { LS_KEYS } from "../utils/constants";
import { getMe } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(LS_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(LS_KEYS.TOKEN) || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data);
          localStorage.setItem(LS_KEYS.USER, JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(LS_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(LS_KEYS.TOKEN, authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LS_KEYS.USER);
    localStorage.removeItem(LS_KEYS.TOKEN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuth: !!user && !!token,
        role: user?.role || null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
