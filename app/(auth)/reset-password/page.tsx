import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import loginImg from "@/public/img/login/login.webp";
import ResetPasswordForm from "@/components/from/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Spomov",
  description:
    "Set a new password for your Spomov account. Enter and confirm your new password to regain access.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen dark:bg-darkPrimary p-5">
      {/* Left visual panel */}
      <div className="w-1/2 h-full bg-primary dark:bg-gradient-to-br dark:from-[#2B2499] dark:to-[#6C63FF] rounded-2xl center flex-col">
        <Image
          src={loginImg}
          alt="reset password image"
          className="w-full h-full object-cover rounded-2xl right-0"
          priority
        />
      </div>

      {/* Right form panel */}
      <div className="w-1/2 h-full center">
        <div className="max-w-md w-md mx-auto">
          <h1 className="text-3xl font-medium mt-5 text-gray-700 dark:text-gray-400">
            Reset <span className="text-primary">Password</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 pr-10">
            Enter your new password and confirm it to complete the reset.
          </p>

          <ResetPasswordForm />

          <div className="text-sm text-center mt-5 space-x-3">
            <Link href="/login" className="text-primary font-medium">
              Back to Login
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/sign-up" className="text-primary font-medium">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
