"use client";

import clsx from "clsx";
import { getSession, signIn } from "next-auth/react";
import { clearSessionCache } from "@/lib/apollo-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@components/common/button/Button";
import { EMAIL_REGEX, SIGNIN_IMG, IMAGES } from "@/utils/constants";
import InputText from "@components/common/form/Input";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useMergeCart } from "@utils/hooks/useMergeCart";
import { getCookie } from "@utils/getCartToken";
import { setCookie } from "@utils/helper";
import { setLocalStorage } from "@/store/local-storage";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/user-slice";
import { BagistoUser } from "@/types/types";
import { useCartDetail } from "@utils/hooks/useCartDetail";
import { GUEST_CART_ID, GUEST_CART_TOKEN, IS_GUEST } from "@/utils/constants";
import { useState } from "react";
import ShortcutsDrawer from "./ShortcutsDrawer";
import MobileNavHeader from "../layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

type LoginFormInputs = {
  username: string;
  password: string;
};

const ShortcutIcon = () => (
  <Image src={IMAGES.settings} alt="Shortcuts" width={24} height={24} className="w-6 h-6 invert dark:invert-0" />
);

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useCustomToast();
  const { getCartDetail } = useCartDetail()
  const { mergeCart } = useMergeCart();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);


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
      const guestCartId = getCookie(GUEST_CART_ID);
      const guestCartToken = getCookie(GUEST_CART_TOKEN);

      const result = await signIn("credentials", {
        redirect: false,
        ...data,
        callbackUrl: "/",
      });

      if (!result?.ok) {
        showToast(result?.error || "Invalid login credentials.", "warning");
        return;
      }
      showToast("Welcome! Successfully logged in.", "success");
      setLocalStorage("email", data?.username)

      const session = await getSession();
      const userToken: string | undefined = session?.user?.accessToken;


      clearSessionCache();

      if (!userToken) {
        console.warn("No API token available in session after login");
      }

      if (session?.user) {
        dispatch(setUser(session.user as unknown as BagistoUser));
      }

      if (userToken && guestCartId && guestCartToken) {
        try {
          await mergeCart({ variables: { token: userToken, cartId: parseInt(guestCartId, 10) } });
          setCookie(GUEST_CART_TOKEN, userToken);
          setCookie(IS_GUEST, "false");
          await getCartDetail();
        } catch (err) {
          console.error("mergeCart failed:", err);
        }
      } else if (userToken) {
        setCookie(GUEST_CART_TOKEN, userToken);
        setCookie(IS_GUEST, "false");
      }
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 100);


    } catch (error) {
      console.error(error);
      showToast("Something went wrong. Please try again.", "danger");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-132px)] lg:min-h-0">
      <HideMainNavOnMobile />
      <div className="sticky top-0 z-[60] block lg:hidden w-full bg-white dark:bg-black">
          <MobileNavHeader backUrl="/" />
      </div>

      <div className="flex-1 flex flex-col pt-4 lg:pt-0">
        <div className="flex w-full items-center max-w-screen-2xl mx-auto px-4 xss:px-7.5 justify-between gap-4 lg:my-16 xl:my-28">
          <div className="flex w-full max-w-[583px] flex-col gap-y-4 lg:gap-y-12">
            <div className="font-outfit">
              <h2 className="py-1 text-2xl font-semibold sm:text-4xl">
                Sign in to your account
              </h2>
              <p className="mt-2  text-base md:text-lg font-normal text-black/60 dark:text-selected-white">
                If you have an account, sign in with your email address.
              </p>
            </div>

            <form
              noValidate
              className="flex flex-col gap-y-4 lg:gap-y-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-3.5 lg:gap-4">
                <InputText
                  {...register("username", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Please enter a valid email.",
                    },
                  })}
                  errorMsg={
                    errors.username?.message ? [errors.username.message] : undefined
                  }
                  label="Enter Your Email Address"
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
                  errorMsg={
                    errors.password?.message ? [errors.password.message] : undefined
                  }
                  label="Enter Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter your password"
                  rounded="md"
                  size="lg"
                  typeName="password"
                />

                <Link
                  className="text-end text-sm font-medium text-primary dark:text-primary-soft underline hover:text-primary"
                  href="/customer/forget-password"
                  aria-label="Go to forgot password page"
                >
                  Forgot your password ?
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
                <span className="mx-auto font-outfit sm:mx-0">
                  New customer?{" "}
                  <Link
                    className="font-medium text-primary dark:text-primary-soft hover:text-primary underline"
                    href="/customer/register"
                    aria-label="Go to create account page"
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
                "transition duration-300 ease-in-out group-hover:scale-105"
              )}
              sizes={"(min-width: 768px) 66vw, 100vw"}
              src={SIGNIN_IMG}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-auto pt-10 pb-[96px] flex justify-center w-full">
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
