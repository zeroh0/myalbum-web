import TextField from "@/app/components/TextField";

export const USERNAME_PATTERN = /^[a-z0-9_-]{3,20}$/;
export const USERNAME_ERROR =
  "사용자명은 영문 소문자, 숫자, -, _ 로 3~20자여야 합니다.";

export function isValidUsername(value: string) {
  return USERNAME_PATTERN.test(value);
}

export default function UsernameField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <TextField
      id="username"
      label="사용자명"
      type="text"
      required
      minLength={3}
      maxLength={20}
      pattern="[a-z0-9_-]+"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="yourname"
      hint={
        <>
          영문 소문자, 숫자, -, _ 만 사용 가능하며 앨범 주소로 사용됩니다:{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            myalbum.com/{value || "yourname"}
          </span>
        </>
      }
    />
  );
}
