"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import MobileNavHeader from "../layout/navbar/MobileNavHeader";
import { getThemeCustomizationAction, userSubscribe } from "@/utils/actions";
import FaceBookIcon from "@components/common/icons/social-icon/FaceBookIcon";
import InstaGramIcon from "@components/common/icons/social-icon/InstaGramIcon";
import TwitterIcon from "@components/common/icons/social-icon/TwitterIcon";
import { ThemeOptions, FooterColumns, ThemeCustomizationResult } from "@/types/theme/theme-customization";
import { safeParse } from "@/utils/helper";
import { isArray } from "@/utils/type-guards";
import { useForm } from "react-hook-form";
import { RecoverPasswordFormState } from "@components/customer/types";
import { useCustomToast } from "@utils/hooks/useToast";
import { EMAIL_REGEX } from "@utils/constants";
import clsx from "clsx";
import LoadingDots from "@components/common/icons/LoadingDots";

interface ShortcutsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

const getUrlparams = (url: string) => {
  const splitUrl = url.split("/");
  if (isArray(splitUrl) && splitUrl.length >= 1) {
    return `/${splitUrl.at(splitUrl.length - 1)}`;
  }
  return "/";
};

export default function ShortcutsDrawer({ isOpen, onClose, onNavigate }: ShortcutsDrawerProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [footerData, setFooterData] = useState<ThemeCustomizationResult | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{email: string}>({ mode: "onSubmit" });
  const { showToast } = useCustomToast();
  const [status, setStatus] = useState<RecoverPasswordFormState["errors"] | null>(null);

  const onSubmit = async (data: {email: string}) => {
    setStatus(null);
    const formData = new FormData();
    formData.append("email", data.email);
    setLoading(true);
    const result = await userSubscribe({}, formData);
    setStatus(result?.errors || null);
    if (result?.errors?.apiRes?.status) {
      reset();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status) {
      setTimeout(() => setStatus(null), 3500);
    }
    if (status?.email) showToast(status?.email[0], "warning");
    if (status?.apiRes?.status === false) showToast(status?.apiRes?.msg, "warning");
    if (status?.apiRes?.status === true) showToast("Successfully Subscribed", "success");
  }, [status]);

  useEffect(() => {
    if (isOpen && !footerData) {
      getThemeCustomizationAction().then((res) => {
        if (res) setFooterData(res);
      });
    }
  }, [isOpen, footerData]);

  const footerLinksNode = footerData?.footer_links?.themeCustomizations?.edges?.[0]?.node;
  const footerTranslation = footerLinksNode?.translations?.edges?.[0]?.node;
  const footerOptions = (typeof footerTranslation?.options === "string"
    ? safeParse<FooterColumns>(footerTranslation.options)
    : footerTranslation?.options) as FooterColumns | null | undefined;

  let column1: ThemeOptions[] = footerOptions?.column_1 || [];
  let column2: ThemeOptions[] = footerOptions?.column_2 || [];
  const socialLinks: ThemeOptions[] = footerOptions?.column_3 || [];

  const aboutUsIndexCol2 = column2.findIndex((i: ThemeOptions) => i.title.toLowerCase() === 'about us');
  const shippingIndexCol1 = column1.findIndex((i: ThemeOptions) => i.title.toLowerCase() === 'shipping');
  
  if (aboutUsIndexCol2 !== -1 && shippingIndexCol1 !== -1) {
    const c1 = [...column1];
    const c2 = [...column2];
    const aboutUsItem = c2[aboutUsIndexCol2];
    const shippingItem = c1[shippingIndexCol1];
    c1[shippingIndexCol1] = aboutUsItem;
    c2[aboutUsIndexCol2] = shippingItem;
    c1.splice(shippingIndexCol1, 1);
    c1.unshift(aboutUsItem);
    column1 = c1;
    column2 = c2;
  } else if (aboutUsIndexCol2 !== -1) {
    const c1 = [...column1];
    const c2 = [...column2];
    const aboutUsItem = c2.splice(aboutUsIndexCol2, 1)[0];
    c1.unshift(aboutUsItem);
    column1 = c1;
    column2 = c2;
  }

  const socialIconMapping: Record<string, React.JSX.Element> = {
    facebook: <FaceBookIcon />,
    instagram: <InstaGramIcon />,
    twitter: <TwitterIcon />,
    x: <TwitterIcon />,
  };

  const getSocialIcon = (title: string) => {
    const key = title.toLowerCase();
    return socialIconMapping[key] || null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-surface-darkest lg:hidden drawer-scrollbar-hidden overflow-hidden"
          >
            <MobileNavHeader onBack={onClose} />

            <div className="flex-1 overflow-y-auto drawer-scrollbar-hidden flex flex-col w-full px-4 pt-5 pb-8">
              <h2 className="font-outfit font-semibold text-2xl text-black dark:text-white leading-none mb-6">
                Shortcuts
              </h2>

              <div className="flex flex-col gap-2 mb-6">
                <h3 className="font-outfit font-semibold text-sm text-black/50 dark:text-white/50 leading-none">Theme</h3>
                <div className="flex items-center justify-between h-[58px]">
                  <span className="font-outfit font-medium text-base text-black dark:text-white">
                    {isDark ? "Dark" : "Light"}
                  </span>
                  <div 
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className={clsx(
                      "relative flex items-center w-[38px] h-[22.4px] rounded-full p-[2.4px] cursor-pointer transition-colors duration-200",
                      isDark ? "bg-neutral-600" : "bg-primary"
                    )}
                    role="switch"
                    aria-checked={!isDark}
                  >
                    <div 
                      className={clsx(
                        "w-[17.6px] h-[17.6px] bg-white rounded-full shadow-sm transition-transform duration-200",
                        isDark ? "translate-x-0" : "translate-x-[15.6px]"
                      )}
                    />
                  </div>
                </div>
              </div>

              {isArray(column1) && column1.length > 0 && (
                <div className="flex flex-col gap-4 mb-6">
                  <h3 className="font-outfit font-semibold text-sm text-black/50 dark:text-white/50 leading-none">Company</h3>
                  <div className="flex flex-col gap-4">
                    {column1.map((item: ThemeOptions, index: number) => (
                      <Link
                        key={item.url ?? index}
                        href={getUrlparams(item.url)}
                        onClick={onNavigate}
                        className="font-outfit font-medium text-base text-black dark:text-white leading-none"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {isArray(column2) && column2.length > 0 && (
                <div className="flex flex-col gap-4 mb-6">
                  <h3 className="font-outfit font-semibold text-sm text-black/50 dark:text-white/50 leading-none">Support</h3>
                  <div className="flex flex-col gap-4">
                    {column2.map((item: ThemeOptions, index: number) => (
                      <Link
                        key={item.url ?? index}
                        href={getUrlparams(item.url)}
                        onClick={onNavigate}
                        className="font-outfit font-medium text-base text-black dark:text-white leading-none"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full h-px bg-surface-cool dark:bg-neutral-800 mb-6"></div>

              {isArray(socialLinks) && socialLinks.length > 0 && (
                <div className="flex items-center gap-3.5 mb-6 h-6">
                  {socialLinks.map((item: ThemeOptions, index: number) => {
                    const icon = getSocialIcon(item.title);
                    if (!icon) return null;
                    return (
                      <Link
                        key={item.title ?? index}
                        href={item.url}
                        target="_blank"
                        className="cursor-pointer text-black/60 dark:text-selected-white hover:text-black dark:hover:text-white transition-colors"
                        aria-label={item.title}
                      >
                        {icon}
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="w-full flex flex-col gap-4">
                <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-outfit font-semibold text-base leading-[20px] text-black dark:text-white">Newsletter</h3>
                    <p className="font-outfit font-normal text-sm leading-[20px] text-black dark:text-white">
                      Subscribe to our newsletter for exclusive offers!
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="flex gap-3 h-10 w-full">
                      <input
                        type="email"
                        aria-label="Email Address"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: EMAIL_REGEX,
                            message: "Enter a valid email",
                          },
                        })}
                        className={clsx(
                          "flex-1 min-w-0 h-10 rounded-2xl border-[1.5px] bg-overlay-subtle dark:bg-white/5 px-3.5 py-2.5 font-outfit text-15 leading-[20px] text-black dark:text-white outline-none focus:ring-1 focus:ring-neutral-300",
                          errors.email || status?.email
                            ? "border-red-500"
                            : "border-white dark:border-neutral-800"
                        )}
                        placeholder="Email address"
                      />
                      <button
                        type="submit"
                        disabled={loading || isSubmitting}
                        className={clsx(
                          "w-[105px] h-10 rounded-2xl bg-primary text-white border-[1.5px] border-border-cool px-5 py-2.5 font-outfit font-medium text-15 leading-[20px] flex items-center justify-center flex-shrink-0 transition-opacity",
                          {
                            "hover:opacity-90": !isSubmitting,
                            "cursor-not-allowed opacity-50": isSubmitting,
                          }
                        )}
                        title="Subscribe"
                      >
                        {loading || isSubmitting ? (
                          <div className="flex items-center gap-1">
                            <LoadingDots className="bg-white !w-1 !h-1" />
                          </div>
                        ) : (
                          "Subscribe"
                        )}
                      </button>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
