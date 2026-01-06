"use client";
import { FC, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AddressDataTypes } from "@/types/types";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import { isObject } from "@/utils/type-guards";
import { useCheckout } from "@utils/hooks/useCheckout";
import InputText from "@components/common/form/Input";
import { ProceedToCheckout } from "./ProceedToCheckout";
import CheckBox from "@components/theme/ui/element/Checkbox";
import { useDispatch } from "react-redux";
import { setCheckoutAddresses } from "@/store/slices/cart-slice";


export const GuestAddAdressForm: FC<{
  billingAddress?: AddressDataTypes | null;
  shippingAddress?: AddressDataTypes | null;
}> = ({ billingAddress: initialBilling, shippingAddress: initialShipping }) => {
  const email = getLocalStorage(EMAIL);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [billingAddress, setBillingAddress] = useState<AddressDataTypes | null>(
    initialBilling ?? null
  );
  const [shippingAddress, setShippingAddress] =
    useState<AddressDataTypes | null>(initialShipping ?? null);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      billing: {
        email: billingAddress?.email ?? email ?? "",
        firstName: billingAddress?.firstName || "",
        lastName: billingAddress?.lastName || "",
        companyName: billingAddress?.companyName || "",
        address: billingAddress?.address || "",
        country: billingAddress?.country || "IN",
        state: billingAddress?.state || "UP",
        city: billingAddress?.city || "",
        postcode: billingAddress?.postcode || "",
        phone: billingAddress?.phone || "",
      },
      shipping: {
        email: shippingAddress?.email ?? email ?? "",
        firstName: shippingAddress?.firstName || "",
        lastName: shippingAddress?.lastName || "",
        companyName: shippingAddress?.companyName || "",
        address: shippingAddress?.address || "",
        country: shippingAddress?.country || "IN",
        state: shippingAddress?.state || "UP",
        city: shippingAddress?.city || "",
        postcode: shippingAddress?.postcode || "",
        phone: shippingAddress?.phone || "",
      },
      useForShipping: true,
    },
  });

  useEffect(() => {
    if (initialBilling || initialShipping) {
      setBillingAddress(initialBilling ?? null);
      setShippingAddress(initialShipping ?? null);

      reset({
        billing: {
          email: initialBilling?.email ?? email ?? "",
          firstName: initialBilling?.firstName || "",
          lastName: initialBilling?.lastName || "",
          companyName: initialBilling?.companyName || "",
          address: initialBilling?.address || "",
          country: initialBilling?.country || "IN",
          state: initialBilling?.state || "UP",
          city: initialBilling?.city || "",
          postcode: initialBilling?.postcode || "",
          phone: initialBilling?.phone || "",
        },
        shipping: {
          email: initialShipping?.email ?? email ?? "",
          firstName: initialShipping?.firstName || "",
          lastName: initialShipping?.lastName || "",
          companyName: initialShipping?.companyName || "",
          address: initialShipping?.address || "",
          country: initialShipping?.country || "IN",
          state: initialShipping?.state || "UP",
          city: initialShipping?.city || "",
          postcode: initialShipping?.postcode || "",
          phone: initialShipping?.phone || "",
        },
        useForShipping: true,
      });
    }
  }, [initialBilling, initialShipping, reset, email]);

  const { isLoadingToSave, saveCheckoutAddress } = useCheckout();

  const watchUseForShipping = watch("useForShipping", true);

  const addGuestAddress = async (data: any) => {
    const billing = data?.billing;
    const shipping = data?.shipping;

    const useForShipping = Boolean(data.useForShipping);
    const shippingSource = useForShipping ? billing : shipping;

    const payload: any = {
      billingFirstName: billing.firstName,
      billingLastName: billing.lastName,
      billingEmail: billing.email ?? email ?? "",
      billingAddress: billing.address,
      billingCity: billing.city,
      billingCountry: billing.country || "IN",
      billingState: billing.state || "UP",
      billingPostcode: billing.postcode,
      billingPhoneNumber: billing.phone,
      billingCompanyName: billing.companyName,
      useForShipping,
    };

    if (!useForShipping) {
      payload.shippingFirstName = shipping.firstName;
      payload.shippingLastName = shipping.lastName;
      payload.shippingEmail = shipping.email ?? email ?? "";
      payload.shippingAddress = shipping.address;
      payload.shippingCity = shipping.city;
      payload.shippingCountry = shipping.country;
      payload.shippingState = shipping.state;
      payload.shippingPostcode = shipping.postcode;
      payload.shippingPhoneNumber = shipping.phone;
      payload.shippingCompanyName = shipping.companyName;
    }

    try {
      await saveCheckoutAddress(payload as any);
      dispatch(
        setCheckoutAddresses({
          billing: {
            ...billing,
            email: billing.email ?? email ?? "",
          },
          shipping: {
            ...shippingSource,
            email: shippingSource.email ?? email ?? "",
          },
        })
      );
      setBillingAddress({
        ...billing,
        email: billing.email ?? email ?? "",
      } as AddressDataTypes);

      setShippingAddress({
        ...shippingSource,
        email: shippingSource.email ?? email ?? "",
      } as AddressDataTypes);

      setIsOpen(true);
    } catch (error) {
      console.error("Failed to save checkout address", error);
    }
  };

  const showSummary = isObject(shippingAddress) && isObject(billingAddress);

  const AddressForm = () => (
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
            pattern: {
              value: /^[\d\s\-\+\(\)]+$/,
              message: "Please enter a valid phone number"
            },
            validate: (value) => {
              const cleaned = value.replace(/\D/g, '');
              return cleaned.length >= 10 || "Phone must be at least 10 digits";
            }
          })}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="col-span-6"
          errorMsg={errors?.billing?.phone?.message}
          label="Phone *"
          size="md"
        />
        <CheckBox
          className="col-span-6 mt-3"
          defaultValue={watchUseForShipping}
          id="useForShipping"
          label="Use the same address for shipping?"
          {...register("useForShipping")}
        />
      </div>

      {!watchUseForShipping && (
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
      )}

      <div className="justify-self-end">
        <ProceedToCheckout buttonName="Next" pending={isLoadingToSave} />
      </div>
    </form>
  );

  if (showSummary && isOpen) {
    return (
      <>
        <div className="mt-4  items-start  hidden sm:flex">
          <div className="flex flex-col justify-between px-2 w-full">
            <div className="flex">
              <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
                Billing Address
              </p>
              <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
                <div className="flex flex-col">
                  <p className="text-base font-medium">
                    {`${billingAddress?.firstName || ""} ${billingAddress?.lastName || ""
                      }`}
                  </p>
                  <p className="text-base font-medium text-zinc-500">
                    {`${billingAddress?.companyName || ""}`}
                  </p>
                </div>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`${billingAddress?.address || ""}, ${billingAddress?.postcode || ""
                    }`}
                </p>
                <p className="text-zinc-500">
                  {billingAddress?.city || ""} {billingAddress?.state || ""},
                  {billingAddress?.country || ""}
                </p>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`T: ${billingAddress?.phone || ""}`}
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
                Shipping Address
              </p>
              <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
                <div className="flex flex-col">
                  <p className="text-base font-medium">
                    {`${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""
                      }`}
                  </p>
                  <p className="text-base font-medium text-zinc-500">
                    {`${shippingAddress?.companyName || ""}`}
                  </p>
                </div>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`${shippingAddress?.address || ""}, ${shippingAddress?.postcode || ""
                    }`}
                </p>
                <p className="text-zinc-500">
                  {shippingAddress?.city || ""} {shippingAddress?.state || ""},
                  {shippingAddress?.country || ""}
                </p>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`T: ${shippingAddress?.phone || ""}`}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
          >
            Change
          </button>
        </div>
        <div className="mt-4 flex sm:hidden items-start justify-between relative">
          <div className="flex flex-col justify-between px-2 w-full">
            <div className="flex justify-between justify-between  flex-1 wrap">
              <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
                Billing Address
              </p>
              <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
                <div className="flex flex-col">
                  <p className="text-base font-medium">
                    {`${billingAddress?.firstName || ""} ${billingAddress?.lastName || ""
                      }`}
                  </p>
                  <p className="text-base font-medium text-zinc-500">
                    {`${billingAddress?.companyName || ""}`}
                  </p>
                </div>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`${billingAddress?.address || ""}, ${billingAddress?.postcode || ""
                    }`}
                </p>
                <p className="text-zinc-500">
                  {billingAddress?.city || ""} {billingAddress?.state || ""},
                  {billingAddress?.country || ""}
                </p>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`T: ${billingAddress?.phone || ""}`}
                </p>
              </div>
            </div>
            <div className="flex justify-between justify-between  flex-1 wrap">
              <p className="w-[184px] text-base font-normal text-black/60 dark:text-white/60">
                Shipping Address
              </p>
              <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
                <div className="flex flex-col">
                  <p className="text-base font-medium">
                    {`${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""
                      }`}
                  </p>
                  <p className="text-base font-medium text-zinc-500">
                    {`${shippingAddress?.companyName || ""}`}
                  </p>
                </div>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`${shippingAddress?.address || ""}, ${shippingAddress?.postcode || ""
                    }`}
                </p>
                <p className="text-zinc-500">
                  {shippingAddress?.city || ""} {shippingAddress?.state || ""},
                  {shippingAddress?.country || ""}
                </p>
                <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                  {`T: ${shippingAddress?.phone || ""}`}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer absolute right-0 text-base font-normal text-black/[60%] underline dark:text-neutral-300"
            style={{ top: "-36px" }}
          >
            Change
          </button>
        </div>
      </>
    );
  }

  return <AddressForm />;
};