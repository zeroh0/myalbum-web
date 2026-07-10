import TextField from "@/app/components/TextField";

export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/;
export const USERNAME_ERROR =
  "사용자명은 3~20자이며, 소문자, 숫자, 밑줄(_) 및 하이픈(-)만 사용할 수 있습니다. 시작과 끝은 소문자 또는 숫자로 해야 합니다.";

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
      pattern="[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="yourname"
      hint={
        <>
          {USERNAME_ERROR} 앨범 주소로 사용됩니다:{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            myalbum.com/{value || "yourname"}
          </span>
        </>
      }
    />
  );
}
