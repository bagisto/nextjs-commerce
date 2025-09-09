"use server";
import { revalidateTag } from "next/cache";

import { addCheckoutAddress, updateCustomerAddress } from "@/lib/bagisto";
import { TAGS } from "@/lib/constants";
import { isObject } from "@/lib/type-guards";
import { FieldValues } from "react-hook-form";

export async function createCheckoutAddress(formData: FieldValues) {
  const addressData = {
    useForShipping: formData.saveAddress ? formData.saveAddress : false,
    ...formData,
  };

  const checkoutInfo = {
    input: {
      billing: {
        ...addressData,
        defaultAddress: false,
      },
      shipping: {
        ...addressData,
        defaultAddress: false,
      },
    },
  };

  const result = await addCheckoutAddress({ ...checkoutInfo });

  if (isObject(result?.cart)) {
    return {
      succsess: true,
      error: {},
      data: result?.cart,
    };
  }
}

export async function proccedCheckoutAddress(formData: any) {
  const result = await addCheckoutAddress({ ...formData });

  if (isObject(result?.cart)) {
    return {
      succsess: true,
      error: {},
      data: result?.cart,
    };
  }
}

export async function updateAddress(prevState: any, formData: FormData) {
  const addressData = {
    email: formData.get("email"),
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    companyName: formData.get("companyName") || "India",
    address: formData.get("address"),
    country: formData.get("country") || "IN",
    state: formData.get("state") || "UP",
    city: formData.get("city"),
    postcode: formData.get("postcode"),
    phone: formData.get("phone"),
    defaultAddress: false,
  };

  // const validatedFields = schema.safeParse({
  //   ...addressData,
  // });

  // if (!validatedFields.success) {
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //   };
  // }

  const { id, ...inputWithoutId } = addressData;
  const result = await updateCustomerAddress({
    id: id,
    input: {
      ...inputWithoutId,
    },
  });

  if (isObject(result?.updateAddress)) {
    revalidateTag(TAGS.address);

    return {
      errors: {},
      data: result?.updateAddress,
    };
  }
}
