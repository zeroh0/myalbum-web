"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/app/components/AuthCard";
import UsernameField, {
  USERNAME_ERROR,
  isValidUsername,
} from "@/app/components/UsernameField";
import { useAuth } from "@/app/lib/auth-context";
import type { ApiResponse } from "@/app/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function OnboardingPage() {
  const router = useRouter();
  const { accessToken, loading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidUsername(username)) {
      setError(USERNAME_ERROR);
      return;
    }
    if (!accessToken) {
      setError("로그인 정보가 확인되지 않았습니다. 다시 로그인해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/member/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ username }),
      });
      const body: ApiResponse<unknown> = await res.json();
      if (!body.success) {
        throw new Error(body.message || "사용자명 등록에 실패했습니다. 다시 시도해주세요.");
      }
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "사용자명 등록에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!authLoading && !accessToken) {
    return (
      <AuthCard title="사용자명 설정">
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          로그인 정보가 확인되지 않았습니다.{" "}
          <Link
            href="/login"
            className="font-medium text-red-600 hover:underline"
          >
            다시 로그인
          </Link>
          해주세요.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="사용자명 설정">
      <p className="mb-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        소셜 계정으로 가입이 거의 끝났어요! 마지막으로 앨범 주소로 사용할
        사용자명을 정해주세요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <UsernameField value={username} onChange={setUsername} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || authLoading}
          className="mt-2 h-11 rounded-full bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "저장 중..." : "계속하기"}
        </button>
      </form>
    </AuthCard>
  );
}
