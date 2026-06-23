"use client";

import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import InputText from "@components/common/form/Input";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useRouter } from "next/navigation";
import { EMAIL_REGEX, SIGNUP_IMG, IS_VALID_INPUT, IMAGES } from "@utils/constants";
import { createUser } from "@utils/actions";
import { Button } from "@components/common/button/Button";

import { RegisterInputs } from "./types";
import { useState } from "react";
import ShortcutsDrawer from "./ShortcutsDrawer";
import MobileNavHeader from "../layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

const ShortcutIcon = () => (
  <Image src={IMAGES.settings} alt="Shortcuts" width={24} height={24} className="w-6 h-6 invert dark:invert-0" />
);

export default function RegistrationForm() {
  const router = useRouter();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { showToast } = useCustomToast();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    if (data.password !== data.passwordConfirmation) {
      showToast("The Passwords do not match.", "warning");
      return;
    }

    await createUser(data)
      .then((res) => {
        if (res?.success) {
          showToast("User created successfully", "success");
          router.replace("/customer/login");
        } else {
          showToast(res?.error?.message || "Failed to create user", "warning");
        }
      })
      .catch((error) => {
        showToast(error.message || "An error occurred", "warning");
      });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-64px)] lg:min-h-0">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-full bg-white dark:bg-black">
          <MobileNavHeader backUrl="/" />
      </div>

      <div className="flex-1 flex flex-col pt-5 lg:pt-0">
        <div className="flex w-full items-center max-w-screen-2xl mx-auto px-4 xss:px-7.5 justify-between gap-0 md:gap-4 lg:my-16 xl:my-28">
          <div className="relative flex w-full max-w-[583px] flex-col gap-y-4 lg:gap-y-12">
            <div className="font-outfit">
              <h2 className="py-1 text-2xl font-semibold sm:text-4xl">
                Become User
              </h2>
              <p className="mt-2 text-base md:text-lg font-normal text-black/[60%] dark:text-selected-white sm:mt-2">
                You are new to our store, we are glad to have you as a member.
              </p>
            </div>

            <form
              noValidate
              className="flex flex-col gap-y-5 lg:gap-y-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-3.5 lg:gap-[18px]">
                <div className="flex w-full gap-2.5 lg:gap-[18px]">
                  <InputText
                    {...register("firstName", {
                      required: "First name is required",
                      pattern: {
                        value: IS_VALID_INPUT,
                        message: "Invalid First Name",
                      },
                    })}
                    className="w-full"
                    errorMsg={
                      errors.firstName?.message
                        ? [errors.firstName.message]
                        : undefined
                    }
                    label="First Name"
                    labelPlacement="outside"
                    name="firstName"
                    placeholder="Enter first name"
                    size="lg"
                  />
                  <InputText
                    {...register("lastName",
                      {
                        required: "Last name is required",
                        pattern: {
                          value: IS_VALID_INPUT,
                          message: "Invalid Last Name",
                        },
                      })}
                    className="w-full"
                    errorMsg={
                      errors.lastName?.message
                        ? [errors.lastName.message]
                        : undefined
                    }
                    label="Last Name"
                    labelPlacement="outside"
                    name="lastName"
                    placeholder="Enter last name"
                    size="lg"
                  />
                </div>

                <InputText
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Please enter a valid email.",
                    },
                  })}
                  errorMsg={errors.email?.message}
                  label="Email"
                  labelPlacement="outside"
                  name="email"
                  placeholder="Enter email address"
                  size="lg"
                />

                <InputText
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Must be at least 8 characters",
                    },
                    validate: (val) => {
                      if (!/[A-Z]/.test(val))
                        return "Must contain at least one uppercase letter";
                      if (!/[a-z]/.test(val))
                        return "Must contain at least one lowercase letter";
                      if (!/[0-9]/.test(val))
                        return "Must contain at least one number";
                      if (/\s/.test(val)) return "Cannot contain spaces";

                      return true;
                    },
                  })}
                  label="Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter password"
                  typeName="password"
                  size="lg"
                  errorMsg={
                    errors.password?.message ? [errors.password.message] : undefined
                  }
                />

                <InputText
                  {...register("passwordConfirmation", {
                    required: "Please confirm your password",
                  })}
                  label="Confirm Password"
                  labelPlacement="outside"
                  name="passwordConfirmation"
                  placeholder="Enter confirm password"
                  size="lg"
                  typeName="password"
                />
              </div>

              <div className="flex flex-col gap-y-3 mb-8 lg:mb-0">
                <Button
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  title="Sign Up"
                  type="submit"
                />
                <span className="mx-auto md:mx-0 font-outfit">
                  Already have an account?{" "}
                  <Link className="text-primary underline" href="/customer/login" aria-label="Go to sign in page">
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </div>

          <div className="relative hidden aspect-[0.9] max-h-[692px] w-full max-w-[790px] sm:block md:aspect-[1.14]">
            <Image
              fill
              priority
              alt="Sign Up Image"
              className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
              sizes="(min-width: 768px) 66vw, 100vw"
              src={SIGNUP_IMG}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-auto pt-10 pb-[120px] flex justify-center w-full">
        <button
          type="button"
          onClick={() => setIsShortcutsOpen(true)}
          className="w-[181px] h-[47px] bg-surface-muted text-black dark:bg-surface-navy dark:text-white rounded-full flex items-center justify-center gap-1 font-outfit font-medium text-lg leading-none px-10 py-3 shadow-none border-none outline-none"
        >
          <ShortcutIcon />
          <span>Shortcuts</span>
        </button>
      </div>

      <ShortcutsDrawer 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
        onNavigate={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
