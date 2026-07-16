import { generateMetadataForPage } from "@utils/helper";
import { staticSeo } from "@utils/metadata";
import ForgetPasswordForm from "@components/customer/ForgetPassword";
import { Suspense } from "react";
import ForgetSkeleton from "@components/common/skeleton/ForgetSkeleton";

export const revalidate = 3600;

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
