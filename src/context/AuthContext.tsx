import { useContext, createContext, useState, FC, useEffect } from "react";

import { User } from "utils/apiUtils";

const AuthContext = createContext<{
  user: User | null;
}>({
  user: null,
});

interface AuthContextProps {
  user: User | null;
  children: React.ReactNode;
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a AuthProvider");
  }

  return context.user;
};

const AuthProvider: FC<AuthContextProps> = ({ children, user: passedUser }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (Object.keys(passedUser ?? {}).length > 1) {
      setUser(passedUser);
    }
  }, [passedUser]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
