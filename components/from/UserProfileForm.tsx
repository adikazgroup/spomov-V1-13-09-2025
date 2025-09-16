import React, { useState, FormEvent } from "react";
import { Input } from "../ui/input/Input";
import { Select } from "../ui/select/Select";
import { Calendar } from "../ui/calender/Calender";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

// Assuming your components and their types are defined like this
// You would need to create these type definitions for a full TypeScript setup.

interface SelectOption {
  value: string;
  label: string;
}

// --- Type Definitions for the Form State ---
interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
  region: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  birthdate: Date | null;
  bloodgroup: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture: File | null;
  address: Address;
  age: number | "";
  gender: string;
  designation: string;
  image: File | string | null;
}

// --- Form Options Data ---
const countryOptions: SelectOption[] = [
  { value: "USA", label: "United States" },
  { value: "CAN", label: "Canada" },
  { value: "GBR", label: "United Kingdom" },
];

const genderOptions: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-say", label: "Prefer not to say" },
];

const bloodGroupOptions: SelectOption[] = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

// --- React Component ---
const UserProfileForm: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    bio: "",
    birthdate: null,
    bloodgroup: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    profilePicture: null,
    address: {
      street: "",
      city: "",
      postCode: "",
      country: "",
      region: "",
    },
    age: "",
    gender: "",
    designation: "",
    image: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (name: keyof UserProfile, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelectChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      if (file.size > 5000000) {
        console.error("File size exceeds 5MB limit.");
        return;
      }

      setFormValues((prev) => ({ ...prev, image: file }));
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
    setFormValues((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formValues);
    // Add your form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 w-full  bg-white dark:bg-[#0A061F] dark:border-[#221B45] border border-gray-200/80 rounded-md mb-5 between ">
        <h1 className="text-xl font-medium">Profile</h1>

        <button className="bg-[#6C63FF] dark:bg-gradient-to-br dark:from-[#2B2499] dark:to-[#6C63FF] px-4 py-2 text-sm rounded-md text-white">
          Update Profile
        </button>
      </div>

      <div className="p-5 w-full space-y-6 bg-white dark:bg-[#0A061F] dark:border-[#221B45] border border-gray-200/80 rounded-xl ">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formValues.firstName}
            onChange={handleInputChange}
            startIcon={<Icon icon="lucide:user" className="size-4" />}
            required
            placeholder="John"
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formValues.lastName}
            onChange={handleInputChange}
            startIcon={<Icon icon="lucide:user" className="size-4" />}
            required
            placeholder="Doe"
          />
          <Input
            label="Username"
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            startIcon={<Icon icon="lucide:user-check" className="size-4" />}
            required
            placeholder="johndoe123"
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleInputChange}
            startIcon={<Icon icon="lucide:phone" className="size-4" />}
            placeholder="(123) 456-7890"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
            startIcon={<Icon icon="lucide:key" className="size-4" />}
            required
            placeholder="••••••••"
          />
          <Input
            label="Age"
            type="number"
            name="age"
            value={formValues.age as string}
            onChange={handleInputChange}
            startIcon={<Icon icon="lucide:cake" className="size-4" />}
            placeholder="25"
          />

          <div className="md:col-span-2">
            <Input
              label="Designation"
              type="text"
              name="designation"
              value={formValues.designation}
              onChange={handleInputChange}
              startIcon={<Icon icon="lucide:id-card" className="size-4" />}
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="text-sm font-medium dark:font-[350] text-gray-700 dark:text-gray-100"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formValues.bio}
              onChange={handleInputChange}
              placeholder="A short bio about yourself"
              className="flex  w-full rounded-md border border-input dark:border-primary/50 dark:font-[350] bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed "
            >
              <Icon
                icon="lucide:biohazard"
                className="size-4 absolute left-3 flex items-center pointer-events-none text-gray-500"
              />
            </textarea>
          </div>

          <div className="flex items-center gap-6 mt-5">
            <div className="relative group">
              <div className="bg-[#6C63FF] size-20 rounded-full border border-[#6C63FF66] dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF]">
                {profileImage && (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="w-full h-full  rounded-full object-cover  "
                  />
                )}
              </div>

              {profileImage && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={handleImageRemove}
                >
                  <Icon
                    icon="mynaui:trash"
                    className="h-6 w-6 text-red-400 cursor-pointer"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="profile-upload"
                className="font-medium text-sm cursor-pointer text-[#6C63FF] transition-colors duration-200 border border-[#6C63FF66] w-fit px-2.5 py-1 rounded-md "
              >
                Change Photo
              </label>
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/jpeg, image/gif, image/png"
              />
              <p className="text-[13px] text-[#ACB5BD]">
                JPG, GIF or PNG. 5MB max.
              </p>
            </div>
          </div>
        </div>

        <div className="my-8 border-b border-gray-200/80 dark:border-[#2b2257]"></div>

        {/* Advanced Inputs with your provided components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            startIcon={<Icon icon="lucide:mail" className="size-4" />}
            fullWidth
            onValueChange={(value) =>
              setFormValues((prev) => ({ ...prev, email: value }))
            }
            error={
              formValues.email && !formValues.email.includes("@")
                ? "Please enter a valid email"
                : ""
            }
            value={formValues.email}
          />

          <Select
            label="Country"
            placeholder="Select your country"
            options={countryOptions}
            startIcon={<Icon icon="lucide:globe" className="size-4" />}
            fullWidth
            helperText="Select the country you're based in"
            defaultValue={formValues.address.country}
            onValueChange={handleAddressSelectChange}
          />

          <Calendar
            label="Birthdate"
            value={formValues.birthdate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, birthdate: date }))
            }
            showTodayButton={false}
            placeholder="Select birthdate"
            helperText="Please select your date of birth"
            startIcon={<Icon icon="lucide:cake" className="size-4" />}
          />

          <Select
            label="Gender"
            placeholder="Select your gender"
            options={genderOptions}
            startIcon={<Icon icon="lucide:user-x" className="size-4" />}
            fullWidth
            defaultValue={formValues.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          />

          <Select
            label="Blood Group"
            placeholder="Select your blood group"
            options={bloodGroupOptions}
            startIcon={<Icon icon="lucide:heart" className="size-4" />}
            fullWidth
            defaultValue={formValues.bloodgroup}
            onValueChange={(value) => handleSelectChange("bloodgroup", value)}
          />
        </div>

        <div className="my-8 border-b border-gray-200/80 dark:border-[#2b2257]"></div>

        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Street"
            type="text"
            name="street"
            value={formValues.address.street}
            onChange={handleAddressChange}
            startIcon={<Icon icon="lucide:map" className="size-4" />}
            placeholder="Write your street address"
          />
          <Input
            label="City"
            type="text"
            name="city"
            value={formValues.address.city}
            onChange={handleAddressChange}
            startIcon={<Icon icon="lucide:map" className="size-4" />}
            placeholder="Write your city"
          />
          <Input
            label="Region"
            type="text"
            name="region"
            value={formValues.address.region}
            onChange={handleAddressChange}
            startIcon={<Icon icon="lucide:map" className="size-4" />}
            placeholder="Write your region or state"
          />
          <Input
            label="Postal Code"
            type="text"
            name="postCode"
            value={formValues.address.postCode}
            onChange={handleAddressChange}
            startIcon={<Icon icon="lucide:map" className="size-4" />}
            placeholder="Write your postal code"
          />
        </div>
      </div>
    </form>
  );
};

export default UserProfileForm;
