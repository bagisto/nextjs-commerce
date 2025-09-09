import dynamic from "next/dynamic";
import { Suspense } from "react";

import { AuthPlaceHolder } from "@/components/customer/placeholder";

const ForgetPasswordForm = dynamic(
  () => import("@/components/customer/login/forget-password"),
  {
    ssr: true,
    loading: () => <AuthPlaceHolder />,
  }
);

/* 
  Export metadata object used by Next.js for SEO:
  - title: Sets the document title.
  - description: Sets the meta description for the page.
*/
export const metadata = {
  title: "Forget Password",
  description: "Recover your account by resetting your password.",
};

/* 
  Main React component for the Forget Password page.
  It wraps the dynamically loaded ForgetPasswordForm inside Suspense 
  to handle loading states gracefully.
*/
export default function ForgetPasswordPage() {
  return (
    <Suspense fallback={<AuthPlaceHolder />}>
      <ForgetPasswordForm />
    </Suspense>
  );
}
