"use client";
import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import InputText from "../cart/input";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";
import CheckBox from "@/components/elements/checkbox";
import { useCheckout } from "@/components/hooks/use-checkout";
import { AddressDataTypes, CountryArrayDataType } from "@/lib/bagisto/types";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import { isObject } from "@/lib/type-guards";
// import SelectBox from "../select-filed";
// import RegionDropDown from "@/components/checkout/region-drop-down";
// import SelectField from "../select-filed";
// import { isArray } from "@/lib/type-guards";

const GuestAddAdressForm: FC<{
  countries: CountryArrayDataType[] | null;
  billingAddress?: AddressDataTypes;
  shippingAddress?: AddressDataTypes;
}> = ({ countries, billingAddress, shippingAddress }) => {
  const email = getLocalStorage(EMAIL);
  const [isOpen, setIsOpen] = useState(true);

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      billing: {
        email: billingAddress?.email ?? email,
        firstName: billingAddress?.firstName || "",
        lastName: billingAddress?.lastName || "",
        companyName: billingAddress?.companyName || "",
        address: billingAddress?.address || "",
        country: billingAddress?.country || "IN",
        state: billingAddress?.state || "UP",
        city: billingAddress?.city || "",
        postcode: billingAddress?.postcode || "",
        phone: billingAddress?.phone || "",
        saveAddress: false,
        defaultAddress: false,
      },
      shipping: {
        email: shippingAddress?.email ?? email,
        firstName: shippingAddress?.firstName || "",
        lastName: shippingAddress?.lastName || "",
        companyName: shippingAddress?.companyName || "",
        address: shippingAddress?.address || "",
        country: shippingAddress?.country || "IN",
        state: shippingAddress?.state || "UP",
        city: shippingAddress?.city || "",
        postcode: shippingAddress?.postcode || "",
        phone: shippingAddress?.phone || "",
        saveAddress: false,
        defaultAddress: false,
      },
      useForShipping: true,
    },
  });
  const { isLoadingToSave, saveCheckoutAddress } = useCheckout();

  const watchShowAge = watch("useForShipping", true);

  const addGuestAddress = async (data: FieldValues) => {
    const billingAddress = data?.billing;
    const shippingAddress = data?.shipping;
    const inputs = {
      input: {
        billing: { ...billingAddress, useForShipping: data?.useForShipping },
        shipping: data?.useForShipping
          ? { ...billingAddress, useForShipping: data?.useForShipping }
          : { ...shippingAddress, useForShipping: data?.useForShipping },
      },
    };
    saveCheckoutAddress(inputs);
  };
  // const selectedCountryCode = watch("billing.country");

  // const selectedCountry = countries?.find(
  //   (c: CountryArrayDataType) => c.code === selectedCountryCode
  // );

  return isObject(shippingAddress) && isObject(billingAddress) ? (
    isOpen ? (
      <div className="mt-4 flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex">
            <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
              Billing Address
            </p>
            <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-medium">
                  {`${billingAddress?.firstName || ""} ${billingAddress?.lastName || ""}`}
                </p>
                <p className="text-base font-medium text-zinc-500">
                  {`${billingAddress?.companyName} `}
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                {`${billingAddress?.address}, ${billingAddress?.postcode}`}
              </p>
              <p className="text-zinc-500">
                {billingAddress?.city} {billingAddress?.state},
                {billingAddress?.countryName},
              </p>
              <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                {`T : ${billingAddress?.phone}`}
              </p>
              <p></p>
            </div>
          </div>
          <div className="flex">
            <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
              Shipping Address
            </p>
            <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-medium">
                  {`${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""}`}
                </p>
                <p className="text-base font-medium text-zinc-500">
                  {`${shippingAddress?.companyName} `}
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                {`${shippingAddress?.address}, ${shippingAddress?.postcode}`}
              </p>
              <p className="text-zinc-500">
                {shippingAddress?.city} {shippingAddress?.state},
                {shippingAddress?.countryName},
              </p>
              <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                {`T : ${shippingAddress?.phone}`}
              </p>
              <p></p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
        >
          Change
        </button>
      </div>
    ) : (
      <form className="my-5" onSubmit={handleSubmit(addGuestAddress)}>
        <div className="my-7 grid grid-cols-6 gap-4">
          <InputText
            {...register("billing.firstName", {
              required: "First name is required",
            })}
            className="col-span-3 mb-4"
            errorMsg={errors?.billing?.firstName?.message}
            label="First Name *"
            size="md"
          />
          <InputText
            {...register("billing.lastName", {
              required: "Last name is required",
            })}
            className="col-span-3 mb-4"
            errorMsg={errors?.billing?.lastName?.message}
            label="Last Name *"
            size="md"
          />
          <InputText
            {...register("billing.companyName")}
            className="col-span-6 mb-2"
            errorMsg={errors?.billing?.companyName?.message}
            label="Company Name"
            size="md"
          />
          <InputText
            {...register("billing.address", {
              required: "Address field is required",
            })}
            className="col-span-6 mb-4"
            errorMsg={errors?.billing?.address?.message}
            label="Street Address *"
            size="md"
          />
          {/* ------Drop Down for Countries------ */}
          {/* <SelectField
          label="Country"
          {...register("shipping.country", {
            required: "The country name is required",
          })}
          className="custom-select w-full rounded-lg border border-zinc-200 bg-white px-5 py-3 text-base text-gray-600 transition-all hover:border-gray-400 focus-visible:outline-none max-md:py-2 max-sm:px-4 max-sm:text-sm"
          helperText={errors?.shipping?.country?.message as string}
          error={errors.shipping?.country}
          renderObj={countries}
        /> */}

          {/* {isArray(selectedCountry?.states) ? (
          
        ) : (
          <InputText
            {...register("billing.state", {
              required: "City field is required",
            })}
            className="col-span-3 mb-4"
            errorMsg={errors?.billing?.city?.message}
            label="City *"
            size="md"
          />
        )} */}

          <InputText
            {...register("billing.city", {
              required: "City field is required",
            })}
            className="col-span-3 mb-4"
            errorMsg={errors?.billing?.city?.message}
            label="City *"
            size="md"
          />
          <InputText
            {...register("billing.postcode", {
              required: "Postcode field is required",
            })}
            className="col-span-3"
            errorMsg={errors?.billing?.postcode?.message}
            label="Zip Code *"
            size="md"
          />
          <InputText
            {...register("billing.phone", {
              required: "Phone field is required",
            })}
            className="col-span-6"
            errorMsg={errors?.billing?.phone?.message}
            label="Phone *"
            size="md"
          />
          <CheckBox
            className="col-span-6 mt-3"
            defaultValue={watchShowAge}
            id="useForShipping"
            label="Use the same address for shipping?"
            {...register("useForShipping")}
          />
        </div>

        {!watchShowAge ? (
          <>
            <div className="my-7 grid grid-cols-6 gap-4">
              <InputText
                {...register("shipping.firstName", {
                  required: "First name is required",
                })}
                className="col-span-3 mb-4"
                errorMsg={errors?.shipping?.firstName?.message}
                label="First Name *"
                size="md"
              />
              <InputText
                {...register("shipping.lastName", {
                  required: "Last name is required",
                })}
                className="col-span-3 mb-4"
                errorMsg={errors?.shipping?.lastName?.message}
                label="Last Name *"
                size="md"
              />
              <InputText
                {...register("shipping.companyName")}
                className="col-span-6 mb-4"
                errorMsg={errors?.shipping?.companyName?.message}
                label="Company Name"
                size="md"
              />
              <InputText
                {...register("shipping.address", {
                  required: "Address field is required",
                })}
                className="col-span-6 mb-4"
                errorMsg={errors?.shipping?.address?.message}
                label="Street Address *"
                size="md"
              />

              {/* <SelectBox
                countries={countries}
                className="col-span-3"
                nameAttr="shipping_country"
                defaultValue={shippingAddress?.country || 'AI'}
                errorMsg={state?.errors?.shipping?.country}
                label="Country/Region *"
              />
              <RegionDropDown
                countries={countries}
                defaultValue={shippingAddress?.state || ''}
                // errorMsg={state?.errors?.shipping?.state}
                name="shipping_state"
                className="col-span-3 sm:col-span-3"
                label="State *"
              /> */}
              <InputText
                {...register("shipping.city", {
                  required: "City field is required",
                })}
                className="col-span-3 mb-4"
                errorMsg={errors?.shipping?.city?.message}
                label="City *"
                size="md"
              />
              <InputText
                {...register("shipping.postcode", {
                  required: "Postcode field is required",
                })}
                className="col-span-3"
                errorMsg={errors?.shipping?.postcode?.message}
                label="Zip Code *"
                size="md"
              />
              <InputText
                {...register("shipping.phone", {
                  required: "Phone field is required",
                })}
                className="col-span-6"
                errorMsg={errors?.shipping?.phone?.message}
                label="Phone *"
                size="md"
              />
            </div>
          </>
        ) : null}

        <div className="justify-self-end">
          <ProceedToCheckout buttonName="Next" pending={isLoadingToSave} />
        </div>
      </form>
    )
  ) : (
    <form className="my-5" onSubmit={handleSubmit(addGuestAddress)}>
      <div className="my-7 grid grid-cols-6 gap-4">
        <InputText
          {...register("billing.firstName", {
            required: "First name is required",
          })}
          className="col-span-3 mb-4"
          errorMsg={errors?.billing?.firstName?.message}
          label="First Name *"
          size="md"
        />
        <InputText
          {...register("billing.lastName", {
            required: "Last name is required",
          })}
          className="col-span-3 mb-4"
          errorMsg={errors?.billing?.lastName?.message}
          label="Last Name *"
          size="md"
        />
        <InputText
          {...register("billing.companyName")}
          className="col-span-6 mb-2"
          errorMsg={errors?.billing?.companyName?.message}
          label="Company Name"
          size="md"
        />
        <InputText
          {...register("billing.address", {
            required: "Address field is required",
          })}
          className="col-span-6 mb-4"
          errorMsg={errors?.billing?.address?.message}
          label="Street Address *"
          size="md"
        />
        {/* ------Drop Down for Countries------ */}
        {/* <SelectField
          label="Country"
          {...register("shipping.country", {
            required: "The country name is required",
          })}
          className="custom-select w-full rounded-lg border border-zinc-200 bg-white px-5 py-3 text-base text-gray-600 transition-all hover:border-gray-400 focus-visible:outline-none max-md:py-2 max-sm:px-4 max-sm:text-sm"
          helperText={errors?.shipping?.country?.message as string}
          error={errors.shipping?.country}
          renderObj={countries}
        /> */}

        {/* {isArray(selectedCountry?.states) ? (
          
        ) : (
          <InputText
            {...register("billing.state", {
              required: "City field is required",
            })}
            className="col-span-3 mb-4"
            errorMsg={errors?.billing?.city?.message}
            label="City *"
            size="md"
          />
        )} */}

        <InputText
          {...register("billing.city", {
            required: "City field is required",
          })}
          className="col-span-3 mb-4"
          errorMsg={errors?.billing?.city?.message}
          label="City *"
          size="md"
        />
        <InputText
          {...register("billing.postcode", {
            required: "Postcode field is required",
          })}
          className="col-span-3"
          errorMsg={errors?.billing?.postcode?.message}
          label="Zip Code *"
          size="md"
        />
        <InputText
          {...register("billing.phone", {
            required: "Phone field is required",
          })}
          className="col-span-6"
          errorMsg={errors?.billing?.phone?.message}
          label="Phone *"
          size="md"
        />
        <CheckBox
          className="col-span-6 mt-3"
          defaultValue={watchShowAge}
          id="useForShipping"
          label="Use the same address for shipping?"
          {...register("useForShipping")}
        />
      </div>

      {!watchShowAge ? (
        <>
          <div className="my-7 grid grid-cols-6 gap-4">
            <InputText
              {...register("shipping.firstName", {
                required: "First name is required",
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.firstName?.message}
              label="First Name *"
              size="md"
            />
            <InputText
              {...register("shipping.lastName", {
                required: "Last name is required",
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.lastName?.message}
              label="Last Name *"
              size="md"
            />
            <InputText
              {...register("shipping.companyName")}
              className="col-span-6 mb-4"
              errorMsg={errors?.shipping?.companyName?.message}
              label="Company Name"
              size="md"
            />
            <InputText
              {...register("shipping.address", {
                required: "Address field is required",
              })}
              className="col-span-6 mb-4"
              errorMsg={errors?.shipping?.address?.message}
              label="Street Address *"
              size="md"
            />

            {/* <SelectBox
                countries={countries}
                className="col-span-3"
                nameAttr="shipping_country"
                defaultValue={shippingAddress?.country || 'AI'}
                errorMsg={state?.errors?.shipping?.country}
                label="Country/Region *"
              />
              <RegionDropDown
                countries={countries}
                defaultValue={shippingAddress?.state || ''}
                // errorMsg={state?.errors?.shipping?.state}
                name="shipping_state"
                className="col-span-3 sm:col-span-3"
                label="State *"
              /> */}
            <InputText
              {...register("shipping.city", {
                required: "City field is required",
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.city?.message}
              label="City *"
              size="md"
            />
            <InputText
              {...register("shipping.postcode", {
                required: "Postcode field is required",
              })}
              className="col-span-3"
              errorMsg={errors?.shipping?.postcode?.message}
              label="Zip Code *"
              size="md"
            />
            <InputText
              {...register("shipping.phone", {
                required: "Phone field is required",
              })}
              className="col-span-6"
              errorMsg={errors?.shipping?.phone?.message}
              label="Phone *"
              size="md"
            />
          </div>
        </>
      ) : null}

      <div className="justify-self-end">
        <ProceedToCheckout buttonName="Next" pending={isLoadingToSave} />
      </div>
    </form>
  );
};

export default GuestAddAdressForm;
