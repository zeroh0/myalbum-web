"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/app/components/AuthCard";
import TextField from "@/app/components/TextField";
import SocialLoginButtons from "@/app/components/SocialLoginButtons";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USERNAME_PATTERN = /^[a-z0-9_-]{3,20}$/;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      setError("사용자명은 영문 소문자, 숫자, -, _ 로 3~20자여야 합니다.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      if (!res.ok) {
        throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="회원가입"
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-red-600 hover:underline"
          >
            로그인
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
          id="username"
          label="사용자명"
          type="text"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-z0-9_-]+"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          hint={
            <>
              영문 소문자, 숫자, -, _ 만 사용 가능하며 앨범 주소로
              사용됩니다:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                myalbum.com/{username || "yourname"}
              </span>
            </>
          }
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
        <TextField
          id="confirmPassword"
          label="비밀번호 확인"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="8자 이상"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 rounded-full bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "가입 중..." : "회원가입"}
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
