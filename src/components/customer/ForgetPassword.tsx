"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { recoverPassword } from "@utils/actions";

import { Button } from "@components/common/button/Button";

import { FORGET_PASSWORD_IMG } from '@/utils/constants';
import InputText from '@components/common/form/Input';
import { useCustomToast } from '@/utils/hooks/useToast';

type ForgetPasswordInputs = {
  email: string;
};

export default function ForgetPasswordForm() {
  const { showToast } = useCustomToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<ForgetPasswordInputs> = async (data: {
    email: string;
  }) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("email", data.email);

    try {
      const result = await recoverPassword({
        email: data?.email,
      });

      // Show success/error API response
      if (result.success) {
        showToast(result.success.msg, "success");
      } else if (result.errors?.apiRes) {
        showToast(result.errors.apiRes?.msg, "danger");
      }

      // Field-specific errors
      if (result.errors?.email) {
        showToast(
          Array.isArray(result.errors.email)
            ? result.errors.email[0]
            : result.errors.email,
          "danger"
        );
      }
    } catch {
      showToast("Something went wrong. Please try again later.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 flex w-full items-center w-full max-w-screen-2xl mx-auto px-[15px] xss:px-7.5 justify-between gap-4 lg:my-16 xl:my-32">
      <div className="flex w-full flex-col gap-y-4 lg:max-w-[583px] lg:gap-y-12">
        <div className="font-outfit">
          <h2 className="py-1 text-3xl font-semibold sm:text-4xl">
            Recover Password
          </h2>
          <p className="mt-2 text-lg font-normal text-black/60 dark:text-neutral-300">
            If you forgot your password, recover it by entering your email
            address.
          </p>
        </div>

        <form
          noValidate
          className="flex flex-col gap-y-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputText
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
            errorMsg={errors?.email?.message ? [errors.email.message] : undefined}
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email address"
            size="lg"
            typeName="email"
          />

          <div className="flex flex-col gap-y-2">
            <Button
              disabled={loading || isSubmitting}
              loading={loading || isSubmitting}
              title="Reset Password"
              type="submit"
            />
            <span className="px-1">
              Back to sign in?{" "}
              <Link className="text-blue-600" href="/customer/login">
                Sign In
              </Link>
            </span>
          </div>
        </form>
      </div>

      <div className="relative hidden aspect-[1] max-h-[692px] w-full max-w-[790px] sm:block md:aspect-[1.14]">
        <Image
          fill
          priority
          alt="Forget Password Illustration"
          className={clsx(
            "relative h-full w-full object-fill",
            "transition duration-300 ease-in-out group-hover:scale-105"
          )}
          sizes={"(min-width: 768px) 66vw, 100vw"}
          src={FORGET_PASSWORD_IMG}
        />
      </div>
    </div>
  );
}
