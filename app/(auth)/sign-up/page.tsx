import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import loginImg from "@/public/img/login/login.webp";
import SignUpForm from "@/components/from/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | Spomov",
  description:
    "Create your Spomov account and become part of the global football family. Sign up to connect with fans, follow live scores, track stats, and enjoy the ultimate football experience from day one.",
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen dark:bg-darkPrimary p-5">
      {/* Left Side Image */}
      <div className="w-1/2 h-full bg-primary dark:bg-gradient-to-br dark:from-[#2B2499] dark:to-[#6C63FF] rounded-2xl center flex-col">
        <Image
          src={loginImg}
          alt="signup image"
          className="w-full h-full object-cover rounded-2xl right-0"
        />
      </div>

      {/* Right Side Content */}
      <div className="w-1/2 h-full center">
        <div className="max-w-md w-md mx-auto">
          <h1 className="text-3xl font-medium mt-5 text-gray-700 dark:text-gray-400">
            Create{" "}
            <span className="text-primary">
              {" "}
              Your <br />
              Spomov{" "}
            </span>{" "}
            Account
          </h1>
          <p className="text-gray-400 text-sm mt-2 pr-10">
            Join Spomov to connect with fans, follow scores, and enjoy.
          </p>
          <SignUpForm />
          <div className="text-sm text-center mt-3">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
