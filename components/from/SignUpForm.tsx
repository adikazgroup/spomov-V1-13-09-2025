"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../ui/input/Input";
import { useMemo, useState } from "react";

interface FormValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm() {
  const initialValue: FormValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>(initialValue);

  const emailError =
    formValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
      ? "Please enter a valid email"
      : "";

  const usernameError =
    formValues.username && formValues.username.trim().length < 3
      ? "Username must be at least 3 characters"
      : "";

  const passwordError =
    formValues.password && formValues.password.length < 6
      ? "Password must be at least 6 characters"
      : "";

  const confirmError =
    formValues.confirmPassword &&
    formValues.confirmPassword !== formValues.password
      ? "Passwords do not match"
      : "";

  const hasErrors = useMemo(
    () => Boolean(emailError || usernameError || passwordError || confirmError),
    [emailError, usernameError, passwordError, confirmError]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasErrors) return;

    setIsLoading(true);
    // Add your sign-up API integration here
    console.log("SignUp submitting:", formValues);

    setTimeout(() => {
      setIsLoading(false);
      alert("Sign-up attempt submitted!");
    }, 2000);
  };

  return (
    <>
      <form
        className="space-y-3 mt-4"
        onSubmit={handleSubmit}
        autoComplete="on"
      >
        {/* Email */}
        <Input
          label="Email"
          type="email"
          className="h-11"
          placeholder="you@example.com"
          startIcon={<Icon icon="lucide:mail" className="size-4" />}
          fullWidth
          required
          value={formValues.email}
          onValueChange={(value) =>
            setFormValues((prev) => ({ ...prev, email: value }))
          }
          error={emailError}
          name="email"
        />

        {/* Username */}
        <Input
          label="Username"
          type="text"
          className="h-11"
          placeholder="Choose a username"
          startIcon={<Icon icon="lucide:user" className="size-4" />}
          fullWidth
          required
          value={formValues.username}
          onValueChange={(value) =>
            setFormValues((prev) => ({ ...prev, username: value }))
          }
          error={usernameError}
          name="username"
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
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
          value={formValues.password}
          onValueChange={(value) =>
            setFormValues((prev) => ({ ...prev, password: value }))
          }
          error={passwordError}
          name="password"
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Re-enter your password"
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
          value={formValues.confirmPassword}
          onValueChange={(value) =>
            setFormValues((prev) => ({ ...prev, confirmPassword: value }))
          }
          error={confirmError}
          name="confirmPassword"
        />

        <button
          type="submit"
          disabled={isLoading || hasErrors}
          className="w-full bg-primary dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] text-white py-2.5 text-sm rounded ani2 mt-2 disabled:bg-[#6ea8e0] disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="loader">Loading...</span> : "Sign Up"}
        </button>
      </form>

      <div className="text-center pt-5">
        <div className="center gap-2">
          <div className="flex-1 border-b border-gray-200 dark:border-gray-700/80"></div>
          <span className="mx-auto text-sm font-medium text-gray-500">OR</span>
          <div className="flex-1 border-b border-gray-200 dark:border-gray-700/80"></div>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-5">
          <button className="px-4 py-2 border rounded-md center gap-2 border-gray-300 dark:border-gray-700/80">
            <Icon icon="devicon:google" className="size-5" />
            Google
          </button>
          <button className="px-4 py-2 border rounded-md center gap-2 border-gray-300 dark:border-gray-700/80">
            <Icon icon="mage:facebook" className="size-5 text-[#1877F2]" />
            Facebook
          </button>
          <button className="px-4 py-2 border rounded-md center gap-2 border-gray-300 dark:border-gray-700/80">
            <Icon
              icon="ri:twitter-x-line"
              className="size-5 text-black dark:text-white"
            />
            Twitter
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-primary font-medium">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary font-medium">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  );
}
