"use client";

import React, { useState, useRef } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCustomToast } from "@/utils/hooks/useToast";
import LoadingDots from "@components/common/icons/LoadingDots";
import { useUpdateProfile } from "@/utils/hooks/useUpdateProfile";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import { CustomDatePicker } from "@components/ui/CustomDatePicker";
import { GENDER_OPTIONS } from "@/utils/constants";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/user-slice";
import { CustomerProfile } from "@/types/customer/type";

interface ProfileEditFormProps {
  user: CustomerProfile | null | undefined;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user.user);
  const { showToast } = useCustomToast();
  const { updateProfile, isLoading: loading } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.image || null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const input: Record<string, unknown> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender?.toLowerCase(),
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        input.password = formData.newPassword;
        input.confirmPassword = formData.confirmPassword;
      }

      if (formData.currentPassword) {
        input.currentPassword = formData.currentPassword;
      }

      const result = await updateProfile(input, selectedFile || undefined);

      if (result.success) {
        if (result.data) {
          dispatch(setUser({
            ...(reduxUser || {}),
            ...result.data,
            name: `${result.data.firstName || ""} ${result.data.lastName || ""}`.trim() || result.data.name || reduxUser?.name || ""
          }));
        }
        router.push("/account/profile");
        router.refresh();
      }
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : "An unexpected error occurred", "danger");
    }
  };

  const inputClassNames = {
    inputWrapper: "h-[42px] min-h-[42px] rounded-md border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-none px-5 transition-all hover:border-primary focus-within:border-primary focus-within:ring-0 data-[hover=true]:border-primary",
    input: "font-outfit font-medium text-sm leading-none text-black dark:text-white placeholder:text-muted placeholder:font-medium placeholder:text-base",
  };

  const labelClasses = "font-outfit font-medium text-sm leading-none tracking-normal text-black dark:text-white";

  return (
    <div className="flex flex-col w-full">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
          <MobileNavHeader backUrl="/account/profile" />
      </div>

      <div className="flex flex-col mb-8 gap-0">
        <div className="hidden lg:block">
          <AccountBreadcrumbs />
        </div>
        <div className="flex items-center gap-3 mt-5 lg:mt-0">
          <h1 className="font-outfit text-2xl lg:text-26 font-semibold lg:font-medium text-black dark:text-white leading-[24px] lg:leading-[40px]">
            Profile
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-[905px]">
        <div 
          onClick={triggerFileInput}
          className="relative w-[200px] h-[200px] border border-dashed border-border dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center gap-7_5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors overflow-hidden group"
        >
          {previewUrl ? (
            <>
              <Image 
                src={previewUrl} 
                alt="Profile Preview" 
                width={200}
                height={200}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-7_5 text-white">
                <Camera size={28} />
                <span className="text-xs font-outfit">Change Image</span>
              </div>
            </>
          ) : (
            <>
              <Camera size={28} className="text-muted" />
              <span className="font-outfit text-sm text-muted">Add Image</span>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            name="image"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>First Name</label>
            <Input
              name="firstName"
              placeholder="First name"
              variant="bordered"
              value={formData.firstName}
              onChange={handleChange}
              classNames={inputClassNames}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>Last Name</label>
            <Input
              name="lastName"
              placeholder="Last name"
              variant="bordered"
              value={formData.lastName}
              onChange={handleChange}
              classNames={inputClassNames}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>Gender</label>
            <Select
              name="gender"
              placeholder="Select gender"
              variant="bordered"
              selectedKeys={formData.gender ? [formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)] : []}
              onChange={handleChange}
              classNames={{
                trigger: "h-[42px] min-h-[42px] rounded-md border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-none px-5 transition-all hover:border-primary data-[hover=true]:border-primary",
                value: "font-outfit font-medium text-sm leading-none text-black dark:text-white",
                base: "w-full",
              }}
            >
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>Date of Birth</label>
            <CustomDatePicker
              value={formData.dateOfBirth}
              onChange={(val) => setFormData(prev => ({ ...prev, dateOfBirth: val }))}
              placeholder="DD/MM/YYYY"
              displayFormat="DD/MM/YYYY"
              showClearIcon={false}
              style={{ height: "42px" }}
              className="h-[42px] !rounded-md cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              variant="bordered"
              value={formData.email}
              onChange={handleChange}
              classNames={inputClassNames}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>Mobile Number</label>
            <Input
              name="phone"
              placeholder="Mobile Number"
              variant="bordered"
              value={formData.phone}
              onChange={handleChange}
              classNames={inputClassNames}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-3">
            <label className={labelClasses}>Enter your current password</label>
            <Input
              name="currentPassword"
              type="password"
              placeholder="Password"
              variant="bordered"
              autoComplete="new-password"
              value={formData.currentPassword}
              onChange={handleChange}
              classNames={inputClassNames}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className={labelClasses}>New password</label>
              <Input
                name="newPassword"
                type="password"
                placeholder="Password"
                variant="bordered"
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
                classNames={inputClassNames}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className={labelClasses}>Confirm new password</label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Password"
                variant="bordered"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                classNames={inputClassNames}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            isLoading={loading}
          className="bg-primary hover:bg-blue-700 text-white font-semibold w-[160px] h-12 lg:w-[196px] lg:h-13 lg:px-20 lg:py-4 gap-2.5 rounded-full text-base leading-[100%] font-outfit transition-all flex items-center justify-center"
          spinner={<LoadingDots className="bg-white" />}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
