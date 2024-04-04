'use server';
import {
  addCheckoutAddress,
  addPaymentMethod,
  addShippingMethod,
  createPlaceOrder
} from 'lib/bagisto';
import { TAGS } from 'lib/constants';
import { isObject } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email('This is not a valid email.'),
  country: z.string({ required_error: 'Country is required' }),
  firstName: z
    .string({ required_error: 'First Name is required' })
    .min(1, { message: 'Please Enter First name' }),
  address1: z
    .string({ required_error: 'Address is required' })
    .min(1, { message: 'Address is required!' }),
  city: z.string({ required_error: 'City is required' }).min(1, { message: 'City is required' }),
  state: z.string({ required_error: 'State is required' }).min(1, { message: 'State is required' }),
  postcode: z
    .string({ required_error: 'Zipcode is required' })
    .min(1, { message: 'Zip code is required' }),
  phone: z
    .string({ required_error: 'Phone Number is required' })
    .min(1, { message: 'Phone Number is required' })
});
export async function createCheckoutAddress(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    country: formData.get('country'),
    firstName: formData.get('firstName'),
    address1: formData.get('address1'),
    city: formData.get('city'),
    state: formData.get('state'),
    postcode: formData.get('postcode'),
    phone: formData.get('phone')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const checkoutInfo = {
    billingAddressId: 0,
    shippingAddressId: 0,
    billing: {
      defaultAddress: false,
      companyName: 'C. Trades',
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      address1: formData.get('address1'),
      address2: formData.get('address2'),
      city: formData.get('city'),
      country: formData.get('country'),
      state: formData.get('state'),
      postcode: formData.get('postcode'),
      phone: formData.get('phone'),
      useForShipping: false,
      isSaved: false
    },
    shipping: {
      defaultAddress: false,
      companyName: 'C. Trades',
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      address1: formData.get('address1'),
      address2: formData.get('address2'),
      city: formData.get('city'),
      country: formData.get('country'),
      state: formData.get('state'),
      postcode: formData.get('postcode'),
      phone: formData.get('phone'),
      isSaved: false
    },
    type: 'shipping'
  };
  const result = await addCheckoutAddress(checkoutInfo);

  if (isObject(result)) {
    revalidateTag(TAGS.cart);
    return {
      shippingAddress: { ...checkoutInfo },
      cart: { ...(result.cart as Object) },
      shippingMethos: result.shippingMethods
    };
  }
}

const shippingSchema = z.object({
  shippingMethod: z
    .string({ required_error: 'City is required' })
    .min(1, { message: 'City is required' })
});

export async function createShippingMethod(prevState: any, formData: FormData) {
  const validatedFields = shippingSchema.safeParse({
    shippingMethod: formData.get('shippingMethod')
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const result = await addShippingMethod({
    shippingMethod: formData.get('shippingMethod') as string
  });
  if (isObject(result)) {
    return {
      paymentMethods: result?.paymentMethods,
      cart: { ...(result?.cart as object) }
    };
  }
}

const methodSchema = z.object({
  method: z
    .string({ required_error: 'Method is required' })
    .min(1, { message: 'Method is required' })
});

export async function createPaymentMethod(prevState: any, formData: FormData) {
  const validatedFields = methodSchema.safeParse({
    method: formData.get('method')
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }
  const result = await addPaymentMethod({ method: formData.get('method') as string });

  if (isObject(result)) {
    revalidateTag(TAGS.cart);
    return {
      formattedPrice: { ...(result.cart.formattedPrice as Object) },
      selectedShippingRate: { ...(result.cart.selectedShippingRate as Object) },
      payment: { ...(result?.cart.payment as Object) }
    };
  }
}

export async function placeOrder() {
  const result = await createPlaceOrder();
  if (isObject(result?.order)) {
    return result;
  }
}
