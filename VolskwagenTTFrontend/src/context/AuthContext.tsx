import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  player: any | null;
  login: (playerData: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<any | null>(
    JSON.parse(localStorage.getItem("player") || "null")
  );

  const login = (playerData: any) => {
    setPlayer(playerData);
    localStorage.setItem("player", JSON.stringify(playerData));
  };

  const logout = () => {
    setPlayer(null);
    localStorage.removeItem("player");
  };

  return (
    <AuthContext.Provider value={{ player, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
