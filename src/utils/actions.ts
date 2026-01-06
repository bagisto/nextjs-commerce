"use server";
import { redirect } from "next/navigation";
import {
  createUserToLogin,
  logoutUser,
  recoverUserLogin,
  subsCribeUser,
} from '@/utils/bagisto';
import { isObject } from "@utils/type-guards";
import { RegisterInputs } from "@components/customer/RegistrationForm";
import { RecoverPasswordFormState } from "@components/customer/types";

export type RegisterFormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
    apiError?: string;
    agreement?: string[];
  };
};

export async function redirectToCheckout(formData: FormData) {
  const url = formData.get("url") as string;
  redirect(url);
}


export async function createUser(formData: RegisterInputs) {
  try {
    const { firstName, lastName, email, password, passwordConfirmation } =
      formData;

    const user = await createUserToLogin({
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    });

    return {
      error: {},
      success: true,
      customer: user,
    };
  } catch (err: any) {
    return {
      error: { message: err?.message || "An error occurred" },
      success: false,
      customer: {},
    };
  }
}


export async function recoverPassword(formData: {
  email: string;
}): Promise<RecoverPasswordFormState> {

  const result = await recoverUserLogin({ email: formData.email }) as any;

  if (isObject(result?.error)) {
    const error = result.error as Record<string, unknown>;
    return {
      errors: {
        apiRes: {
          status: false,
          msg: (error?.message as string) ?? "Something went wrong",
        },
      },
    };
  }

  const body = result?.body;
  const createForgotPassword = body?.data?.createForgotPassword;
  const forgotPassword = createForgotPassword?.forgotPassword;

  return {
    success: {
      status: forgotPassword?.success ?? false,
      msg: "Recovery email sent successfully.",
    },
  };
}




export async function userSubscribe(
  _prevState: RecoverPasswordFormState,
  formData: FormData
): Promise<RecoverPasswordFormState> {
  const email = formData.get("email");

  const data = {
    email: typeof email === "string" ? email.trim() : "",
  };

  try {
    const result = await subsCribeUser(data) as Record<string, unknown>;

    if (result?.error) {
      const error = result.error as Record<string, unknown>;
      return {
        errors: {
          apiRes: {
            status: false,
            msg: (error.message as string) || "Something went wrong",
          },
        },
      };
    }

    const body = result?.body as Record<string, unknown>;
    const bodyData = body?.data as Record<string, unknown>;

    return {
      errors: {
        apiRes: {
          status: true,
          msg: (bodyData?.message as string) || "Subscription successful!",
        },
      },
    };
  } catch {
    return {
      errors: {
        apiRes: {
          status: false,
          msg: "Unexpected error occurred. Please try again.",
        },
      },
    };
  }
}


export async function logoutAction() {
  return await logoutUser();
}