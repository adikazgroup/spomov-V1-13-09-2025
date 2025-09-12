import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import LoginForm from "@/components/from/LoginForm";
import loginImg from "@/public/img/login/login.webp";

export const metadata: Metadata = {
  title: "Login | Spomov",
  description:
    "Login to Spomov and join the ultimate football community. Connect with fans, track live scores, explore stats, and experience the beautiful game like never before.",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen  dark:bg-darkPrimary p-5">
      <div className="w-1/2 h-full bg-primary dark:bg-gradient-to-br dark:from-[#2B2499] dark:to-[#6C63FF] rounded-2xl center flex-col">
        <Image
          src={loginImg}
          alt="login image"
          className="w-full h-full object-cover rounded-2xl right-0"
        />
      </div>
      <div className="w-1/2 h-full center ">
        <div className="max-w-md w-md mx-auto ">
          <h1 className="text-3xl font-medium mt-5 text-gray-700 dark:text-gray-400">
            Log{" "}
            <span className="text-primary">
              {" "}
              in <br />
              To your{" "}
            </span>{" "}
            Account
          </h1>
          <p className="text-gray-400 text-sm mt-2 pr-10">
            Please enter your registered email address and password carefully to
            securely log in and access your Spomov account.
          </p>
          <LoginForm />
          <div className="text-sm text-center mt-5 ">
            Don&lsquo;t have an account?{" "}
            <Link href="/sign-up" className="text-primary font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
