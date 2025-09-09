import RegistrationForm from "@/components/customer/login/registration-form";

/* 
  Metadata object providing SEO information such as
  the page title and description.
*/
export const metadata = {
  title: "Registration Form",
  description: "Customer registration page",
};

export default async function Register() {
  return <RegistrationForm />;
}
