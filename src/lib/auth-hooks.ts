import { useEffect, useState } from "react";
import * as jose from "jose";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me");
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        setUser({
          id: payload.userId as string,
          email: payload.email as string,
          role: payload.role as string || "user",
        });
      } catch {
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return { user, loading, logout };
}