"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/app/components/AuthCard";
import TextField from "@/app/components/TextField";
import SocialLoginButtons from "@/app/components/SocialLoginButtons";
import { useAuth, type Member } from "@/app/lib/auth-context";
import { useGlobalLoading } from "@/app/lib/loading-context";
import type { ApiResponse } from "@/app/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { withLoading } = useGlobalLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await withLoading(async () => {
        const res = await fetch(`${API_URL}/api/member/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const body: ApiResponse<{
          tokenResponse: { accessToken: string };
          loginMember: Member;
        }> = await res.json();
        if (!body.success || !body.data) {
          throw new Error(
            body.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
          );
        }
        login(body.data.tokenResponse.accessToken, body.data.loginMember);
        router.push("/");
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="로그인"
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-red-600 hover:underline"
          >
            회원가입
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          id="email"
          label="이메일"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <TextField
          id="password"
          label="비밀번호"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8자 이상"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 rounded-full bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        또는
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <SocialLoginButtons />
    </AuthCard>
  );
}
