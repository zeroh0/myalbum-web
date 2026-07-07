"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ApiResponse } from "@/app/lib/api";

const ONBOARDING_PATH = "/signup/onboarding";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Member = {
  memberId: number;
  username: string | null;
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
  completeOnboarding: (username: string) => void;
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
  const pathname = usePathname();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // username을 아직 입력하지 않은 PENDING 회원은 추가입력을 마치기 전까지
  // 어떤 페이지에 있든 온보딩 페이지로 보낸다.
  useEffect(() => {
    if (!loading && member?.status === "PENDING" && pathname !== ONBOARDING_PATH) {
      router.replace(ONBOARDING_PATH);
    }
  }, [loading, member, pathname, router]);

  // refreshToken 쿠키(SameSite=Strict, Secure)를 이용해 새로고침 후에도
  // 로그인 상태를 복구한다. localhost는 포트가 달라도 same-site로 취급되어
  // http://localhost:3000 -> http://localhost:9000 요청에도 쿠키가 실린다.
  //
  // AbortController로 실제 요청 자체를 취소한다: 개발 모드 StrictMode는 이
  // effect를 두 번 실행하는데, 취소 없이 fetch만 두 번 날아가면 같은 회원에
  // 대해 /api/auth/refresh가 짧은 시간에 두 번 호출되어 백엔드에서 토큰
  // 발급이 겹치는 경합을 유발할 수 있다.
  useEffect(() => {
    const controller = new AbortController();

    async function bootstrap() {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("no session");
        const body: ApiResponse<TokenResponse> = await res.json();
        if (!body.data) throw new Error("no token");
        const memberData = await fetchMember(body.data.accessToken);
        setAccessToken(body.data.accessToken);
        setMember(memberData);
        setLoading(false);
      } catch {
        if (controller.signal.aborted) return;
        setAccessToken(null);
        setMember(null);
        setLoading(false);
      }
    }

    bootstrap();
    return () => {
      controller.abort();
    };
  }, []);

  const login = useCallback((token: string, loggedInMember: Member) => {
    setAccessToken(token);
    setMember(loggedInMember);
  }, []);

  // 온보딩 API가 성공한 직후, 서버를 다시 조회하지 않고도 로컬 상태를
  // 곧바로 ACTIVE로 반영해 전역 PENDING 리다이렉트 가드에 걸리지 않게 한다.
  const completeOnboarding = useCallback((username: string) => {
    setMember((prev) => (prev ? { ...prev, username, status: "ACTIVE" } : prev));
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

  // 리다이렉트가 완료되기 전까지 온보딩 대상 페이지의 내용이 잠깐이라도
  // 보이지 않도록 자식 렌더링을 생략한다.
  const blockedByOnboarding =
    !loading && member?.status === "PENDING" && pathname !== ONBOARDING_PATH;

  return (
    <AuthContext.Provider
      value={{ accessToken, member, loading, login, logout, completeOnboarding }}
    >
      {blockedByOnboarding ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
