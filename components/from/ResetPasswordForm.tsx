"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../ui/input/Input";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || ""; // optional: ?token=...

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const passwordError =
    password && password.length < 6
      ? "Password must be at least 6 characters"
      : "";

  const confirmError =
    confirm && confirm !== password ? "Passwords do not match" : "";

  const hasErrors = Boolean(
    passwordError || confirmError || !password || !confirm
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasErrors) return;

    setIsLoading(true);
    // TODO: integrate your backend route (e.g., POST /api/auth/reset-password)
    // Example payload: { token, password }
    // await fetch("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) })

    setTimeout(() => {
      setIsLoading(false);
      setDone(true);
    }, 1200);
  };

  if (done) {
    return (
      <div className="mt-7 rounded-lg border border-gray-200 dark:border-gray-700/80 p-5">
        <div className="center gap-3">
          <Icon icon="lucide:check-circle2" className="size-5 text-green-500" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>
        </div>
        <a
          href="/login"
          className="w-full inline-block text-center bg-primary dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] text-white py-2.5 text-sm rounded ani2 mt-4"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-6 mt-7" onSubmit={handleSubmit} autoComplete="on">
      {/* New Password */}
      <Input
        label="New Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter new password"
        required
        className="h-11"
        startIcon={<Icon icon="lucide:lock" className="size-4" />}
        endIcon={
          showPassword ? (
            <Icon
              icon="lucide:eye"
              className="size-4 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Icon
              icon="lucide:eye-off"
              className="size-4 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )
        }
        fullWidth
        value={password}
        onValueChange={setPassword}
        error={passwordError}
        name="password"
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        placeholder="Re-enter new password"
        required
        className="h-11"
        startIcon={<Icon icon="lucide:lock-keyhole" className="size-4" />}
        endIcon={
          showConfirm ? (
            <Icon
              icon="lucide:eye"
              className="size-4 cursor-pointer"
              onClick={() => setShowConfirm(false)}
            />
          ) : (
            <Icon
              icon="lucide:eye-off"
              className="size-4 cursor-pointer"
              onClick={() => setShowConfirm(true)}
            />
          )
        }
        fullWidth
        value={confirm}
        onValueChange={setConfirm}
        error={confirmError}
        name="confirmPassword"
      />

      <button
        type="submit"
        disabled={isLoading || hasErrors}
        className="w-full bg-primary dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] text-white py-2.5 text-sm rounded ani2 mt-2 disabled:bg-[#6ea8e0] disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="loader">Loading...</span>
        ) : (
          "Reset Password"
        )}
      </button>

      {/* Optional token status hint (hidden if no token) */}
      {token ? (
        <p className="text-[11px] text-gray-500 mt-1">
          Reset token detected. If this link is expired, request a new one.
        </p>
      ) : null}
    </form>
  );
}
