"use client";

import clsx from "clsx";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "./loading-button";

import { SIGNIN_IMG } from "@/lib/constants";
import InputText from "@/components/checkout/cart/input";
import { useCustomToast } from "@/components/hooks/use-toast";

type LoginFormInputs = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const { showToast } = useCustomToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...data,
        callbackUrl: "/",
      });

      if (result?.ok) {
        showToast("Welcome! Successfuly login with Next-Commerce", "success");
        router.replace("/");
      } else {
        // Set API error on root (form-level error)
        showToast(result?.error || "Invalid login credentials.", "warning");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "danger");
    }
  };

  return (
    <div className="my-8 flex w-full items-center justify-between gap-4 lg:my-16 xl:my-28">
      <div className="flex w-full max-w-[583px] flex-col gap-y-4 lg:gap-y-12">
        <div className="font-outfit">
          <h2 className="py-1 text-3xl font-semibold lg:text-4xl">
            Sign in to your account
          </h2>
          <p className="mt-2 text-lg font-normal text-black/[60%] dark:text-neutral-300">
            If you have an account, sign in with your email address.
          </p>
        </div>

        <form
          noValidate
          className="flex flex-col gap-y-4 lg:gap-y-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-y-2.5 lg:gap-[18px]">
            <InputText
              {...register("username", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email.",
                },
              })}
              errorMsg={errors.username ? [errors.username.message] : undefined}
              label="Email"
              labelPlacement="outside"
              name="username"
              placeholder="Enter your email address"
              rounded="md"
              size="lg"
              typeName="email"
            />

            <InputText
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 2,
                  message: "Be at least 2 characters long",
                },
                validate: (value) => {
                  if (!/[0-2]/.test(value))
                    return "Contain at least one number.";

                  return true;
                },
              })}
              errorMsg={errors.password ? [errors.password.message] : undefined}
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              rounded="md"
              size="lg"
              typeName="password"
            />

            <Link
              className="text-end text-sm font-medium text-blue-600 hover:text-blue-500"
              href="/customer/forget-password"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="flex flex-col gap-2 lg:gap-y-3">
            <Button
              className="cursor-pointer"
              disabled={isSubmitting}
              loading={isSubmitting}
              title="Sign In"
              type="submit"
            />
            <span className="font-outfit">
              New customer?{" "}
              <Link
                className="font-medium text-blue-600 hover:text-blue-500"
                href="/customer/register"
              >
                Create your account
              </Link>
            </span>
          </div>
        </form>
      </div>

      <div className="relative hidden aspect-[0.9] max-h-[692px] w-full max-w-[790px] sm:block md:aspect-[1.14]">
        <Image
          fill
          priority
          alt="Sign In Image"
          className={clsx(
            "relative h-full w-full object-fill",
            "transition duration-300 ease-in-out group-hover:scale-105",
          )}
          sizes={"(min-width: 768px) 66vw, 100vw"}
          src={SIGNIN_IMG}
        />
      </div>
    </div>
  );
}
