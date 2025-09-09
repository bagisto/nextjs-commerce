"use client";
import { FC, useActionState, useState } from "react";
import { Checkbox } from "@heroui/checkbox";

import { createCheckoutAddress } from "../action";
import InputText from "../cart/input";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";
import SelectBox from "../select-filed";

import { BagistoCart, CountryArrayDataType } from "@/lib/bagisto/types";
import RegionDropDown from "@/components/checkout/region-drop-down";
import { FieldValues, useForm } from "react-hook-form";
import CheckBox from "@/components/elements/checkbox";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import { useCustomToast } from "@/components/hooks/use-toast";
import { addItem } from "@/store/slices/cart-slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const AddAdressForm: FC<{
  countries: CountryArrayDataType[] | null;
  userEmail?: string;
}> = ({ countries, userEmail }) => {
  const email = getLocalStorage(EMAIL) ?? userEmail;
  const { showToast } = useCustomToast();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
      firstName: "",
      lastName: "",
      country: "IN",
      state: "UP",
      address: "",
      companyName: "",
      city: "",
      postcode: "",
      phone: "",
      saveAddress: true,
    },
  });

  const watchShowAge = watch("saveAddress", true);
  const formAction = async (data: FieldValues) => {
    await createCheckoutAddress({ ...data })
      .then((res) => {
        if (res?.succsess) {
          showToast("Add Address Successfully", "success");
          dispatch(addItem(res?.data as BagistoCart));
          router.replace("/checkout?step=shipping");
        }
      })
      .catch((error) => {
        showToast(error, "danger");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(formAction)} className="my-5">
        <div className="my-7 grid grid-cols-6 gap-4">
          <InputText
            className="col-span-3"
            {...register("firstName", {
              required: "First name is required",
            })}
            errorMsg={errors?.firstName?.message}
            label="First Name *"
            size="md"
          />
          <InputText
            className="col-span-3"
            {...register("lastName", {
              required: "Last name is required",
            })}
            errorMsg={errors?.lastName?.message}
            label="Last Name *"
            size="md"
          />
          <InputText
            className="col-span-6"
            label="Company Name"
            {...register("companyName")}
            size="md"
          />
          <InputText
            className="col-span-6"
            {...register("address", {
              required: "Street Address is required",
            })}
            errorMsg={errors?.address?.message}
            label="Street Address *"
            size="md"
          />

          {/* <SelectBox
            className="col-span-3"
            countries={countries}
            nameAttr="country"
            defaultValue={"AI"}
            // errorMsg={state?.errors?.country}
            label="Country/Region *"
          /> */}
          {/* <RegionDropDown
            className="col-span-3 sm:col-span-3"
            label="State *"
            countries={countries}
            // errorMsg={state?.errors?.state}
            name="state"
          /> */}
          <InputText
            {...register("city", {
              required: "City field is required",
            })}
            className="col-span-3 mb-4"
            errorMsg={errors?.city?.message}
            label="City *"
            size="md"
          />
          <InputText
            {...register("postcode", {
              required: "Postcode field is required",
            })}
            className="col-span-3"
            errorMsg={errors?.postcode?.message}
            label="Zip Code *"
            size="md"
          />
          <InputText
            {...register("phone", {
              required: "Phone field is required",
            })}
            className="col-span-6"
            errorMsg={errors?.phone?.message}
            label="Phone *"
            size="md"
          />
          <CheckBox
            className="col-span-6 mt-3"
            defaultValue={watchShowAge}
            id="saveAddress"
            label="Save this to address book"
            {...register("saveAddress")}
          />
        </div>

        <div className="justify-self-end">
          <ProceedToCheckout
            buttonName="Continue to shipping"
            pending={false}
          />
        </div>
      </form>
    </>
  );
};

export default AddAdressForm;
