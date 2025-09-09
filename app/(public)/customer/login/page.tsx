import LoginForm from "@/components/customer/login/login-form";

/* 
  Export metadata object for SEO and page info:
  - title: The page title shown in the browser tab.
  - description: Meta description for search engines.
*/
export const metadata = {
  title: "Login",
  description:
    "Customer Login And Enjoyed it, Search for products in the store.",
};
export default async function LoginPage() {
  return <LoginForm />;
}
