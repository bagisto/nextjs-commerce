'use server';
import {
  addCheckoutAddress,
  addPaymentMethod,
  addShippingMethod,
  createPlaceOrder
} from 'lib/bagisto';
import { ORDER_ID, TAGS } from 'lib/constants';
import { isObject } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email('This is not a valid email.'),
  country: z
    .string({ required_error: 'Country is required' })
    .min(1, { message: 'Country is required' }),
  companyName: z.string({ required_error: 'Country is required' }),
  firstName: z
    .string({ required_error: 'First Name is required' })
    .min(1, { message: 'Please Enter First name' }),
  lastName: z
    .string({ required_error: 'Last Name is required' })
    .min(1, { message: 'Please Enter Last name' }),
  address: z
    .string({ required_error: 'Address is required' })
    .min(1, { message: 'Address is required!' }),
  city: z.string({ required_error: 'City is required' }).min(1, { message: 'City is required' }),
  state: z.string({ required_error: 'State is required' }).min(1, { message: 'State is required' }),
  postcode: z
    .string({ required_error: 'Zip code is required' })
    .min(1, { message: 'Zip code is required' }),
  phone: z
    .string({ required_error: 'Phone Number is required' })
    .min(1, { message: 'Phone Number is required' })
});
export async function createCheckoutAddress(prevState: any, formData: FormData) {
  const adressData = {
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    companyName: formData.get('companyName'),
    address: formData.get('address'),
    country: formData.get('country'),
    state: formData.get('state'),
    city: formData.get('city'),
    postcode: formData.get('postcode'),
    phone: formData.get('phone')
  };
  console.log(adressData);
  const validatedFields = schema.safeParse({
    ...adressData
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }
  const moreInfo = {
    useForShipping: false,
    saveAddress: false,
    defaultAddress: false
  };
  const checkoutInfo = {
    billing: {
      ...adressData,
      ...moreInfo
    },
    shipping: {
      ...adressData,
      ...moreInfo
    }
  };

  const result = await addCheckoutAddress(checkoutInfo);

  if (isObject(result)) {
    revalidateTag(TAGS.cart);
    redirect('/checkout/shipping');
  }
}

const shippingSchema = z.object({
  shippingMethod: z
    .string({ required_error: 'City is required' })
    .min(1, { message: 'City is required' })
});

export async function createShippingMethod(prevState: any, formData: FormData) {
  const method = { shippingMethod: formData.get('shippingMethod') };
  const validatedFields = shippingSchema.safeParse({
    ...method
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const result = await addShippingMethod({
    method: method.shippingMethod as string
  });
  if (isObject(result)) {
    revalidateTag(TAGS.cart);
    redirect('/checkout/payment');
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
    redirect('/checkout/place-order');
  }
}

export async function placeOrder() {
  const result = await createPlaceOrder();
  if (isObject(result?.order)) {
    const cookieStore = await cookies();
    const orderId = result?.order?.id;
    cookieStore.set({
      name: ORDER_ID,
      value: orderId,
      httpOnly: true,
      path: '/'
    });
    revalidateTag(TAGS.cart);
    redirect(`/cart?order=${orderId}`);
  }
}
