import { useEffect, useState } from "react";
import { api } from "../services/api";

interface SessionUser {
  id: string;
  tenantId: string;
  role: string;
}

export function useSession(version = 0) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<SessionUser>("/me");
        setUser(response.data);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    validateSession();
  }, [version]);

  return {
    isLoading,
    isAuthenticated,
    user
  };
}