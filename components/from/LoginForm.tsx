"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../ui/input/Input";
import { useState } from "react";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const initialValue: FormValues = { email: "", password: "" };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>(initialValue);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Add your login logic here, for example, making an API call
    console.log("Submitting:", formValues);

    // Simulate an API call with a delay
    setTimeout(() => {
      setIsLoading(false);
      alert("Login attempt submitted!");
    }, 2000);
  };
  return (
    <>
      <form
        className="space-y-6 mt-7"
        onSubmit={handleSubmit}
        autoComplete={"on"}
      >
        <Input
          label="Email or Username"
          type="email"
          className="h-11 "
          placeholder="Email or username"
          startIcon={<Icon icon="lucide:mail" className="size-4" />}
          fullWidth
          required
          value={formValues.email}
          onValueChange={(value) => {
            setFormValues((prev) => ({ ...prev, email: value }));
          }}
          error={
            formValues.email && !formValues.email.includes("@")
              ? "Please enter a valid email"
              : ""
          }
          name="email"
        />

        <div className="space-y-2.5">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="h-11  "
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
            onValueChange={(value) => {
              setFormValues((prev) => ({ ...prev, password: value }));
            }}
            name="password"
          />

          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-[13px] text-primary  font-medium"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] text-white py-2.5 text-sm rounded ani2 mt-2 disabled:bg-[#6ea8e0] disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="loader">Loading...</span> : "Log In"}
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
      </div>
    </>
  );
}
