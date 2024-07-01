import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { apiURL } from "~/API";

interface User {
  _id: string;
  githubId: string;
  username: string;
  displayName: string;
  profilePic: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get(apiURL + "/user/profile", { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
