"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ApiResponse } from "@/app/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Member = {
  memberId: number;
  username: string;
  displayName: string | null;
  profileImageUrl: string | null;
  status: string;
};

type TokenResponse = {
  accessToken: string;
  accessTokenExpiresIn: number;
  tokenType: string;
};

type AuthContextValue = {
  accessToken: string | null;
  member: Member | null;
  loading: boolean;
  login: (accessToken: string, member: Member) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMember(accessToken: string): Promise<Member | null> {
  const res = await fetch(`${API_URL}/api/member/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const body: ApiResponse<Member> = await res.json();
  return body.data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // refreshToken 쿠키(SameSite=Strict, Secure)를 이용해 새로고침 후에도
  // 로그인 상태를 복구한다. localhost는 포트가 달라도 same-site로 취급되어
  // http://localhost:3000 -> http://localhost:9000 요청에도 쿠키가 실린다.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("no session");
        const body: ApiResponse<TokenResponse> = await res.json();
        if (!body.data) throw new Error("no token");
        const memberData = await fetchMember(body.data.accessToken);
        if (!cancelled) {
          setAccessToken(body.data.accessToken);
          setMember(memberData);
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setMember(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((token: string, loggedInMember: Member) => {
    setAccessToken(token);
    setMember(loggedInMember);
  }, []);

  const logout = useCallback(async () => {
    if (accessToken) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => {});
    }
    setAccessToken(null);
    setMember(null);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, member, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
