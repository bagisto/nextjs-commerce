"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMAIL, getLocalStorage, setLocalStorage } from "@/store/local-storage";
import Link from "next/link";
import InputText from "@components/common/form/Input";
import { ProceedToCheckout } from "./ProceedToCheckout";
import { delay } from "@utils/helper";
import { EmailFormProps, EmailFormValues } from "../type";



const Email = () => {
  const email = getLocalStorage(EMAIL);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isGuest = true;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    defaultValues: { email },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setLocalStorage(EMAIL, data?.email);
    await delay(200);
    router.push("/checkout?step=address");
  };

  return (
    <>
      {email === "" || typeof email === "object" ? (
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <EmailForm
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            isGuest={isGuest}
          />
        </form>
      ) : isOpen ? (
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <EmailForm
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            isGuest={isGuest}
          />
        </form>
      ) : (
        <>
          <div className="mt-4  justify-between hidden sm:flex">
            <div className="flex">
              <p className="w-auto text-base font-normal text-black/60 dark:text-white/60 sm:w-[192px]">
                Email Address
              </p>
              <p className="font-normal block text-base">{email}</p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
            >
              Change
            </button>
          </div>
          <div className=" relative mt-4 flex sm:hidden flex-col justify-end gap-y-2 sm:flex-row sm:justify-between sm:gap-y-0">
            <div className="flex justify-between  flex-1 wrap">
              <p className="w-auto text-base font-normal text-black/60 dark:text-white/60 sm:w-[192px]">
                Email Address
              </p>
              <p className="font-normal block text-base">{email}</p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer absolute right-0  text-base font-normal text-black/[60%] underline dark:text-neutral-300"
              style={{ top: "-36px" }}
            >
              Change
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Email;

function EmailForm({
  register,
  errors,
  isSubmitting,
  isGuest,
}: EmailFormProps) {
  return (
    <div>
      <InputText
        className="max-w-full"
        id="email"
        size="md"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address",
          }
        })}
        errorMsg={errors?.email?.message as string}
        label="Enter Email *"
        placeholder="example@gmail.com"
        readOnly={!isGuest}
      />

      {isGuest && (
        <p className="mb-4 mt-6 font-outfit text-base font-normal text-black/[60%] dark:text-neutral-300">
          Already have an account? No worries, just{" "}
          <br className="block sm:hidden" />
          <Link
            className="text-base font-normal text-primary"
            href="/customer/login"
          >
            log in.
          </Link>
        </p>
      )}

      <div className="mt-6 justify-self-end">
        <ProceedToCheckout buttonName="Next" pending={isSubmitting} />
      </div>
    </div>
  );
}
