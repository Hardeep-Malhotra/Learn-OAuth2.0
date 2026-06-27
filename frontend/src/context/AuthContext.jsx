// This Context shares "who is logged in" across the whole app,
// so any page/component can check it without re-fetching every time.

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, ask the backend if someone is logged in
  useEffect(() => {
    checkLoginStatus();
  }, []);

  async function checkLoginStatus() {
    try {
      const data = await getCurrentUser();
      if (data.loggedIn) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check login status:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so other components can easily access { user, loading }
export function useAuth() {
  return useContext(AuthContext);
}
