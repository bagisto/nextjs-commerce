import { IMAGES } from "@/utils/constants";

export const staticSeo = {
  default: {
    title: "Bagisto Headless",
    description: "Headless eCommerce with Bagisto",
    image: IMAGES.logo,
    canonical: "/",
  },
  register : {
    title: "Register",
    description: "Register to Bagisto Headless",
    image: IMAGES.logo,
    canonical: "/customer/register",
  },
  login: {
    title: "Login",
    description: "Login to Bagisto Headless",
    image: IMAGES.logo,
    canonical: "/customer/login",
  },
  forget:{
    title: "Forget Password",
  description: "Recover your account by resetting your password.",
  image: IMAGES.logo,
  canonical: "/customer/forget-password",
  }
};
