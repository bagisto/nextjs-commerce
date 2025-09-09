"use server";

import { RecoverPasswordFormState } from "./types";

import { isObject } from "@/lib/type-guards";
import {
  createUserToLogin,
  recoverUserLogin,
  subsCribeUser,
} from "@/lib/bagisto";
import { RegisterInputs } from "../login/registration-form";
import { cookies } from "next/headers";
import { TOKEN } from "@/lib/constants";

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
      agreement: true,
    });

    if (isObject(user?.error)) {
      return {
        error: { message: user?.error?.message },
        success: false,
        customerSignUp: {},
      };
    }

    return {
      error: {},
      success: true,
      customerSignUp: user?.customerSignUp,
    };
  } catch (err: any) {
    return {
      error: { message: err?.message },
      success: false,
      customerSignUp: {},
    };
  }
}

export async function recoverPassword(formData: {
  email: string;
}): Promise<RecoverPasswordFormState> {
  const data = { email: formData?.email };

  const result = await recoverUserLogin(data);

  if (isObject(result?.error)) {
    return {
      errors: {
        apiRes: {
          status: false,
          msg: result?.error?.message ?? "Something went wrong",
        },
      },
    };
  }

  return {
    errors: {
      apiRes: {
        status: true,
        msg:
          result?.body?.data?.forgotPassword?.success ??
          "Recovery email sent successfully.",
      },
    },
  };
}

// Action for subsribe
export async function userSubscribe(
  prevState: RecoverPasswordFormState,
  formData: FormData
): Promise<RecoverPasswordFormState> {
  const email = formData.get("email");

  const data = {
    email: typeof email === "string" ? email.trim() : "",
  };

  try {
    const result = await subsCribeUser(data);

    if (result?.error) {
      return {
        errors: {
          apiRes: {
            status: false,
            msg: result.error.message || "Something went wrong",
          },
        },
      };
    }

    return {
      errors: {
        apiRes: {
          status: true,
          msg: result?.body?.data?.message || "Subscription successful!",
        },
      },
    };
  } catch (error) {
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
