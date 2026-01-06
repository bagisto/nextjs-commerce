import dynamic from "next/dynamic";
import { generateMetadataForPage } from "@utils/helper";
import { staticSeo } from "@utils/metadata";
import { Suspense } from "react";
import ForgetSkeleton from "@components/common/skeleton/ForgetSkeleton";

export const revalidate = 3600;

const ForgetPasswordForm = dynamic(() => import("@components/customer/ForgetPassword"));

export async function generateMetadata() {
  return generateMetadataForPage("", staticSeo.forget);
}

export default function ForgetPasswordPage() {
  return (
    <Suspense fallback={<ForgetSkeleton />}>
      <ForgetPasswordForm />
    </Suspense>
  );
}
