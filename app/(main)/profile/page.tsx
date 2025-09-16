"use client";

import { Icon } from "@iconify/react";
import UserProfileForm from "@/components/from/UserProfileForm";

export default function ProfilePage() {
  const userData = {
    firstName: "Alex",
    lastName: "Johnson",
    bio: "Professional athlete and sports enthusiast. Passionate about basketball and fitness training. Always striving for excellence both on and off the court.",
    birthdate: "1995-03-15",
    bloodGroup: "O+",
    username: "alexj_sports",
    email: "alex.johnson@email.com",
    phoneNumber: "+1 (555) 123-4567",
    password: "********",
    profilePicture: "/athletic-person-profile-photo.jpg",
    address: {
      street: "123 Sports Avenue",
      city: "Los Angeles",
      postCode: "90210",
      country: "United States",
      region: "California",
    },
    age: 28,
    gender: "Male",
    designation: "Professional Athlete of Spomov",
    isEmailVerified: true,
    role: "user",
    status: "active",
  };

  return (
    <main className="container px-4 2xl:px-40 mx-auto py-12 flex gap-5">
      {/* Enhanced Profile Section (Left side - Always visible) */}
      <div className="lg:w-[35%] bg-white dark:bg-[#0A061F] rounded-2xl p-5 card-shadow-lg border border-gray-200/60 dark:border-[#221B45] h-fit">
        {/* Profile Info  */}
        <div className="flex items-center gap-5 mb-7">
          <div className="relative inline-block">
            <div className="size-[7.5rem] rounded-2xl p-1 bg-primary dark:bg-gradient-to-br dark:from-[#2B2499] dark:to-[#6C63FF]"></div>
          </div>
          <div>
            <p className="text-primary text-sm mb-1">@{userData.username}</p>
            <h2 className="text-2xl font-medium">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-gray-500 mb-1 text-[13px]">
              {userData.designation}
            </p>

            {/* Enhanced Status Badges */}
            <div className="flex justify-start gap-3 mt-4">
              <span
                className={`px-5 h-6 pt-0.5 bg-blue-600/10 text-blue-500 dark:text-blue-400 center rounded-full text-xs font-semibold border border-blue-500/50 capitalize `}
              >
                {userData.role}
              </span>
              <span
                className={`px-5 h-6 pt-0.5 bg-primary/10 text-primary dark:text-[#918BFF] center rounded-full text-xs font-semibold border border-primary/50 capitalize `}
              >
                {userData.status}
              </span>
            </div>
          </div>
        </div>

        {/*  Bio Section */}
        <div className="text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Icon icon="proicons:book-info-2" className="size-5 text-primary" />
            About Me
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {userData.bio}
          </p>
        </div>

        {/* Personal Information */}
        <div className="text-left mt-7">
          <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Icon icon="hugeicons:ai-user" className="size-5 text-primary" />
            Personal Information
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Birthdate
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-100/80 dark:bg-[#140d37] p-2.5 rounded-md">
                {userData.birthdate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Age
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-100/80 dark:bg-[#140d37]  p-2.5 rounded-md">
                {userData.age} years
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Gender
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-100/80 dark:bg-[#140d37]  p-2.5 rounded-md">
                {userData.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Blood Group
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-100/80 dark:bg-[#140d37]  p-2.5 rounded-md">
                {userData.bloodGroup}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-left mt-7">
          <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Icon icon="hugeicons:contact" className="size-5 text-primary" />
            Contact Information
          </h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 border border-gray-200/80 dark:border-[#221B45] p-1.5 rounded-md">
              <div className="w-10 h-10 bg-blue-100/70 dark:bg-blue-900/20 rounded-md center">
                <Icon
                  icon="clarity:email-line"
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs  text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-gray-200/80 dark:border-[#221B45]  p-1.5 rounded-md">
              <div className="w-10 h-10 bg-green-100/70 dark:bg-green-900/20 rounded-md center">
                <Icon
                  icon="mdi:phone"
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-gray-900  dark:text-gray-200">
                  {userData.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="text-left mt-7">
          <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Icon icon="proicons:location" className="size-5 text-primary" />
            Address Information
          </h3>

          <div className="p-4 bg-gray-100/80 dark:bg-[#140D37] rounded-md mt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-[#2f2565] rounded-md center">
                <Icon
                  icon="ph:house-line"
                  className="w-5 h-5 text-black dark:text-white mt-1"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-200 mb-0.5">
                  {userData.address.street}
                </p>
                <p className="dark:text-gray-500 text-gray-400 text-sm">
                  {userData.address.city}, {userData.address.region}{" "}
                  {userData.address.postCode}
                </p>
                <p className="dark:text-gray-500 text-gray-400 text-sm">
                  {userData.address.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Details Section (Right side) */}
      <div className="lg:w-[65%] space-y-8">
        <UserProfileForm />
      </div>
    </main>
  );
}
