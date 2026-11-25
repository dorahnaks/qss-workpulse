"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCurrentSession,
  loginClient,
  logoutClient,
} from "@/services/auth.service";
import type {
  AuthSession,
  ClientUser,
  CompanyInfo,
  LoginCredentials,
} from "@/types/auth";

interface AuthContextValue {
  user: ClientUser | null;
  company: CompanyInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUserState: (user: ClientUser) => void;
  updateCompanyState: (company: CompanyInfo) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await fetchCurrentSession();
      if (session) {
        setUser(session.user);
        setCompany(session.company);
      } else {
        setUser(null);
        setCompany(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchCurrentSession()
      .then((session) => {
        if (!active) return;
        if (session) {
          setUser(session.user);
          setCompany(session.company);
        } else {
          setUser(null);
          setCompany(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await loginClient(credentials);
    setUser(session.user);
    setCompany(session.company);
    return session;
  }, []);

  const logout = useCallback(async () => {
    await logoutClient();
    setUser(null);
    setCompany(null);
  }, []);

  const updateUserState = useCallback((nextUser: ClientUser) => {
    setUser(nextUser);
  }, []);

  const updateCompanyState = useCallback((nextCompany: CompanyInfo) => {
    setCompany(nextCompany);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshSession,
        updateUserState,
        updateCompanyState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
