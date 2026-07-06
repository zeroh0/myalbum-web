const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const providers = [
  {
    id: "google",
    label: "Google로 계속하기",
    className:
      "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
    icon: (
      <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    ),
  },
  {
    id: "naver",
    label: "네이버로 계속하기",
    className: "bg-[#03C75A] text-white hover:bg-[#02b350]",
    icon: <span className="text-base font-extrabold leading-none">N</span>,
  },
  {
    id: "kakao",
    label: "카카오로 계속하기",
    className: "bg-[#FEE500] text-[#191919] hover:bg-[#f5dc00]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 4C6.98 4 3 7.24 3 11.2c0 2.53 1.64 4.75 4.12 6.02-.18.66-.65 2.4-.75 2.77-.12.46.17.45.36.33.15-.1 2.38-1.62 3.35-2.28.63.09 1.28.14 1.92.14 5.02 0 9-3.24 9-7.2S17.02 4 12 4Z"
        />
      </svg>
    ),
  },
];

export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <a
          key={provider.id}
          href={`${API_URL}/oauth/${provider.id}`}
          className={`flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors ${provider.className}`}
        >
          {provider.icon}
          {provider.label}
        </a>
      ))}
    </div>
  );
}
