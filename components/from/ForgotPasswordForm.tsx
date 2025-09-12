"use client";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../ui/input/Input";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError =
    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email"
      : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError || !email) return;

    setIsLoading(true);
    // TODO: integrate your API here (e.g., POST /api/auth/forgot-password)
    // await fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1200);
  };

  if (sent) {
    return (
      <div className="mt-7 rounded-lg border border-gray-200 dark:border-gray-700/80 p-5">
        <div className="center gap-3">
          <Icon icon="lucide:check-circle2" className="size-5 text-green-500" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Reset link sent to <span className="font-medium">{email}</span>.
            Please check your inbox (and spam folder). The link will expire
            soon.
          </p>
        </div>
        <button
          onClick={() => setSent(false)}
          className="w-full bg-primary dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] text-white py-2.5 text-sm rounded ani2 mt-4"
        >
          Send Again
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6 mt-7" onSubmit={handleSubmit} autoComplete="on">
      <Input
        label="Email"
        type="email"
        className="h-11"
        placeholder="you@example.com"
        startIcon={<Icon icon="lucide:mail" className="size-4" />}
        fullWidth
        required
        value={email}
        onValueChange={setEmail}
        error={emailError}
        name="email"
      />

      <button
        type="submit"
        disabled={isLoading || !!emailError || !email}
        className="w-full bg-primary dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] text-white py-2.5 text-sm rounded ani2 mt-2 disabled:bg-[#6ea8e0] disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="loader">Loading...</span>
        ) : (
          "Send Reset Link"
        )}
      </button>

      {/* Optional: small tip row */}
      <p className="text-xs text-gray-500">
        Tip: If you signed up with Google/Facebook/Twitter, use that option on
        the login page instead of resetting your password.
      </p>
    </form>
  );
}
