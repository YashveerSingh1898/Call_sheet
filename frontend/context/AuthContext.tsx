"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  tier?: string;
  joinedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  isAccountSidebarOpen: boolean;
  setAccountSidebarOpen: (open: boolean) => void;
  openAccountSidebar: () => void;
  closeAccountSidebar: () => void;
  toggleAccountSidebar: () => void;
  login: (username: string, email?: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoaded: false,
  isAccountSidebarOpen: false,
  setAccountSidebarOpen: () => {},
  openAccountSidebar: () => {},
  closeAccountSidebar: () => {},
  toggleAccountSidebar: () => {},
  login: () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = "callsheet_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAccountSidebarOpen, setAccountSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize object to ensure username exists
        const normalizedUser: User = {
          username: parsed.username || (parsed.email ? parsed.email.split("@")[0] : "director"),
          name: parsed.name || parsed.username || "Director",
          email: parsed.email || `${parsed.username || "director"}@framezero.ai`,
          role: parsed.role || "Lead Commercial Director",
          tier: parsed.tier || "Pro Studio Edition",
          joinedAt: parsed.joinedAt || "September 2026",
          avatar: parsed.avatar,
        };
        setUser(normalizedUser);
      }
    } catch (err) {
      console.error("Failed to load auth user from storage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const openAccountSidebar = () => setAccountSidebarOpen(true);
  const closeAccountSidebar = () => setAccountSidebarOpen(false);
  const toggleAccountSidebar = () => setAccountSidebarOpen((prev) => !prev);

  const login = (usernameInput: string, emailInput?: string, nameInput?: string) => {
    const cleanUsername = usernameInput.trim().replace(/^@/, "") || "director";
    const displayName = nameInput?.trim() || cleanUsername;
    const emailAddress = emailInput?.trim() || `${cleanUsername}@framezero.ai`;

    const newUser: User = {
      username: cleanUsername,
      name: displayName,
      email: emailAddress,
      role: "Lead Commercial Director",
      tier: "Pro Studio Edition",
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };

    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (err) {
      console.error("Failed to persist auth user:", err);
    }
  };

  const logout = () => {
    setUser(null);
    setAccountSidebarOpen(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear auth user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoaded,
        isAccountSidebarOpen,
        setAccountSidebarOpen,
        openAccountSidebar,
        closeAccountSidebar,
        toggleAccountSidebar,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
