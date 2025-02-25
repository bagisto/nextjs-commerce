'use server';
import { createUserToLogin, recoverUserLogin } from 'lib/bagisto';
import { isObject } from 'lib/type-guards';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

/**
 *  Define schema and method for create form validation
 * @param prevState
 * @param formData
 * @returns
 */

const schema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    firstName: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.'
      })
      .trim(),
    passwordConfirmation: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[!@#$%^&*>.<]/, {
        message: 'Contain at least one special character.'
      })
      .trim()
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password and confirm password don't match",
    path: ['confirm']
  });

export async function createUser(prevState: any, formData: FormData) {
  // Ensure formData is defined
  const createUserValues = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation')
  };

  const validatedFields = schema.safeParse(createUserValues);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const result = await createUserToLogin(createUserValues);
  if (isObject(result?.error)) {
    return {
      errors: { apiError: result?.error?.message }
    };
  } else {
    redirect('/customer/login');
  }
}

/**
 *  Define schema and method for forget Password validation
 * @param prevState
 * @param formData
 * @returns
 */
const forgetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim()
});
export async function recoverPassword(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email')
  };
  const validatedFields = forgetSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const result = await recoverUserLogin(data);

  if (isObject(result?.error)) {
    return {
      errors: {
        apiRes: {
          status: false,
          msg: result?.error?.message
        }
      }
    };
  }
  return {
    errors: {
      apiRes: {
        status: true,
        msg: result?.body?.data?.forgotPassword?.success
      }
    }
  };
}

export async function userLogoOut() {
  try {
    cookies().delete('token');
    return {
      error: false,
      success: true
    };
  } catch (e) {
    return {
      error: true,
      success: false
    };
  }
}
