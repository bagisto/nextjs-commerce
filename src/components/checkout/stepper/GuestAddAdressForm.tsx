"use client";
import { FC, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MappedCheckoutAddress, CreateCheckoutAddressVariables } from "@/types/checkout/type";
import { EMAIL, getLocalStorage } from "@/store/local-storage";
import { IS_VALID_ADDRESS, IS_VALID_INPUT } from "@/utils/constants";
import { isObject } from "@/utils/type-guards";
import { useCheckout } from "@utils/hooks/useCheckout";
import InputText from "@components/common/form/Input";
import { ProceedToCheckout } from "./ProceedToCheckout";
import CheckBox from "@components/theme/ui/element/Checkbox";
import { useDispatch } from "react-redux";
import { setCheckoutAddresses } from "@/store/slices/cart-slice";
import { createCustomerAddressAction } from "@/utils/actions";
import { useAppSelector } from "@/store/hooks";
import { AddressDataTypes } from "@/types/types";

interface GuestAddressFormValues {
  billing: {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    postcode: string;
    phone: string;
  };
  shipping: {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    postcode: string;
    phone: string;
  };
  useForShipping: boolean;
}

export const GuestAddAdressForm: FC<{
  billingAddress?: MappedCheckoutAddress | null;
  shippingAddress?: MappedCheckoutAddress | null;
  currentStep?: string;
}> = ({
  billingAddress: initialBilling,
  shippingAddress: initialShipping,
  currentStep,
}) => {
    const email = getLocalStorage(EMAIL);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const [isOpen, setIsOpen] = useState(currentStep !== "address");

    const [billingAddress, setBillingAddress] = useState<MappedCheckoutAddress | null>(
      initialBilling ?? null
    );
    const [shippingAddress, setShippingAddress] =
      useState<MappedCheckoutAddress | null>(initialShipping ?? null);

    const [prevStep, setPrevStep] = useState(currentStep);
    if (currentStep !== prevStep) {
      setPrevStep(currentStep);
      setIsOpen(currentStep !== "address" && isObject(shippingAddress) && isObject(billingAddress));
    }


    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<GuestAddressFormValues>({
      mode: "onSubmit",
      defaultValues: {
        billing: {
          email: billingAddress?.email ?? email ?? "",
          firstName: billingAddress?.firstName || "",
          lastName: billingAddress?.lastName || "",
          companyName: billingAddress?.companyName || "",
          address: billingAddress?.address || "",
          country: billingAddress?.country || "",
          state: billingAddress?.state || "",
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
          country: shippingAddress?.country || "",
          state: shippingAddress?.state || "",
          city: shippingAddress?.city || "",
          postcode: shippingAddress?.postcode || "",
          phone: shippingAddress?.phone || "",
        },
        useForShipping: true,
      },
    });

    useEffect(() => {
      if (initialBilling || initialShipping) {
        const billing = initialBilling ?? null;
        const shipping = initialShipping ?? null;
        requestAnimationFrame(() => {
          setBillingAddress(billing);
          setShippingAddress(shipping);
          setIsOpen(currentStep !== "address" && isObject(shipping) && isObject(billing));
        });

        reset({
          billing: {
            email: initialBilling?.email ?? email ?? "",
            firstName: initialBilling?.firstName || "",
            lastName: initialBilling?.lastName || "",
            companyName: initialBilling?.companyName || "",
            address: initialBilling?.address || "",
            country: initialBilling?.country || "",
            state: initialBilling?.state || "",
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
            country: initialShipping?.country || "",
            state: initialShipping?.state || "",
            city: initialShipping?.city || "",
            postcode: initialShipping?.postcode || "",
            phone: initialShipping?.phone || "",
          },
          useForShipping: true,
        });
      }
    }, [initialBilling, initialShipping, reset, email]);

    const { isLoadingToSave, saveCheckoutAddress } = useCheckout();

    const watchUseForShipping = useWatch({
      control,
      name: "useForShipping",
      defaultValue: true,
    });

    const addGuestAddress = async (data: GuestAddressFormValues) => {
      const billing = data?.billing;
      const shipping = data?.shipping;

      const useForShipping = Boolean(data.useForShipping);
      const shippingSource = useForShipping ? billing : shipping;

      const cleanPhone = (phoneStr: string): string => {
        if (!phoneStr) return "";
        const digits = phoneStr.replace(/\D/g, "");
        return digits.slice(-10);
      };

      const cleanBillingPhone = cleanPhone(billing.phone || "");
      const cleanShippingPhone = cleanPhone(shippingSource.phone || "");

      const payload: CreateCheckoutAddressVariables = {
        billingFirstName: billing.firstName,
        billingLastName: billing.lastName,
        billingEmail: billing.email ?? email ?? "",
        billingAddress: billing.address,
        billingCity: billing.city,
        billingCountry: billing.country || "IN",
        billingState: billing.state || "UP",
        billingPostcode: billing.postcode,
        billingPhoneNumber: cleanBillingPhone,
        billingCompanyName: billing.companyName || "",
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
        payload.shippingPhoneNumber = cleanPhone(shipping.phone || "");
        payload.shippingCompanyName = shipping.companyName || "";
      }

      try {
        await saveCheckoutAddress(payload as unknown as Record<string, unknown>);

        if (isAuthenticated) {
            const addressInput = {
                firstName: billing.firstName,
                lastName: billing.lastName,
                address1: billing.address,
                country: billing.country,
                state: billing.state,
                city: billing.city,
                postcode: billing.postcode,
                phone: cleanBillingPhone,
                defaultAddress: false
            };
            await createCustomerAddressAction(addressInput);
            
            if (!useForShipping) {
                const shippingAddressInput = {
                    firstName: shipping.firstName,
                    lastName: shipping.lastName,
                    address1: shipping.address,
                    country: shipping.country,
                    state: shipping.state,
                    city: shipping.city,
                    postcode: shipping.postcode,
                    phone: cleanShippingPhone,
                    defaultAddress: false
                };
                await createCustomerAddressAction(shippingAddressInput);
            }
        }
        dispatch(
          setCheckoutAddresses({
            billing: {
              ...billing,
              phone: cleanBillingPhone,
              email: billing.email ?? email ?? "",
            } as AddressDataTypes,
            shipping: {
              ...shippingSource,
              phone: cleanShippingPhone,
              email: shippingSource.email ?? email ?? "",
            } as AddressDataTypes,
          })
        );
        setBillingAddress({
          ...billing,
          phone: cleanBillingPhone,
          email: billing.email ?? email ?? "",
        } as MappedCheckoutAddress);

        setShippingAddress({
          ...shippingSource,
          phone: cleanShippingPhone,
          email: shippingSource.email ?? email ?? "",
        } as MappedCheckoutAddress);

        setIsOpen(true);
      } catch (error) {
        console.error("Failed to save checkout address", error);
      }
    };

    const showSummary = isObject(shippingAddress) && isObject(billingAddress);

    if (showSummary && isOpen) {
      return (
        <>
          <div className="mt-4  items-start  hidden sm:flex">
            <div className="flex flex-col justify-between w-full">
              <AddressSummaryRow
                label="Billing Address"
                address={billingAddress}
                rowClassName="flex"
              />
              <AddressSummaryRow
                label="Shipping Address"
                address={shippingAddress}
                rowClassName="flex"
              />
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-selected-white"
            >
              Change
            </button>
          </div>
          <div className="mt-4 flex sm:hidden items-start justify-between relative">
            <div className="flex flex-col justify-between w-full">
              <AddressSummaryRow
                label="Billing Address"
                address={billingAddress}
                rowClassName="flex justify-between flex-1 wrap"
              />
              <AddressSummaryRow
                label="Shipping Address"
                address={shippingAddress}
                rowClassName="flex justify-between flex-1 wrap"
              />
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="cursor-pointer absolute right-0 text-base font-normal text-black/[60%] underline dark:text-selected-white"
              style={{ top: "-36px" }}
            >
              Change
            </button>
          </div>
        </>
      );
    }

    return (
      <form className="my-5" onSubmit={handleSubmit(addGuestAddress)}>
        <div className="my-7 grid grid-cols-6 gap-4">
          <InputText
            {...register("billing.firstName", {
              required: "First name is required",
              pattern: {
                value: IS_VALID_INPUT,
                message: "Invalid First Name",
              },
            })}
            className="col-span-6 xxs:col-span-3 mb-4"
            errorMsg={errors?.billing?.firstName?.message}
            label="First Name"
            labelPlacement="outside"
            placeholder="Enter first name"
            size="md"
          />
          <InputText
            {...register("billing.lastName", {
              required: "Last name is required",
              pattern: {
                value: IS_VALID_INPUT,
                message: "Invalid Last Name",
              },
            })}
            className="col-span-6 xxs:col-span-3 mb-4"
            errorMsg={errors?.billing?.lastName?.message}
            label="Last Name"
            labelPlacement="outside"
            placeholder="Enter last name"
            size="md"
          />
          <InputText
            {...register("billing.companyName", {
              pattern: {
                value: IS_VALID_INPUT,
                message: "Invalid Company Name",
              },
            })}
            className="col-span-6 mb-2"
            errorMsg={errors?.billing?.companyName?.message}
            label="Company Name"
            labelPlacement="outside"
            placeholder="Enter company name"
            showAsterisk={false}
            size="md"
          />
          <InputText
            {...register("billing.address", {
              required: "Address field is required",
              pattern: {
                value: IS_VALID_ADDRESS,
                message: "Invalid Address",
              },
            })}
            className="col-span-6 mb-4"
            errorMsg={errors?.billing?.address?.message}
            label="Street Address"
            labelPlacement="outside"
            placeholder="Enter street address"
            size="md"
          />
          <InputText
            {...register("billing.country", {
              required: "Country field is required",
            })}
            className="col-span-6 xxs:col-span-3 mb-4"
            errorMsg={errors?.billing?.country?.message}
            label="Country"
            labelPlacement="outside"
            placeholder="Enter country"
            size="md"
          />
          <InputText
            {...register("billing.state", {
              required: "State field is required",
            })}
            className="col-span-6 xxs:col-span-3 mb-4"
            errorMsg={errors?.billing?.state?.message}
            label="State"
            labelPlacement="outside"
            placeholder="Enter state"
            size="md"
          />
          <InputText
            {...register("billing.city", {
              required: "City field is required",
              pattern: {
                value: IS_VALID_INPUT,
                message: "Invalid City",
              },
            })}
            className="col-span-6 xxs:col-span-3 mb-4"
            errorMsg={errors?.billing?.city?.message}
            label="City"
            labelPlacement="outside"
            placeholder="Enter city"
            size="md"
          />
          <InputText
            {...register("billing.postcode", {
              required: "Postcode field is required",
              pattern: {
                value: IS_VALID_INPUT,
                message: "Invalid Postcode",
              },
            })}
            className="col-span-6 xxs:col-span-3 mb-4"
            errorMsg={errors?.billing?.postcode?.message}
            label="Zip Code"
            labelPlacement="outside"
            placeholder="Enter zip code"
            size="md"
          />
          <InputText
            {...register("billing.phone", {
              required: "Phone field is required",
              validate: (value) => {
                const isValidFormat = /^\+?[0-9\s\-()]+$/.test(value);
                if (!isValidFormat) {
                  return "Enter Valid Phone Number";
                }
                const digits = value.replace(/\D/g, "");
                if (digits.length < 10) {
                  return "Phone number must contain at least 10 digits";
                }
                return true;
              },
            })}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="col-span-6"
            errorMsg={errors?.billing?.phone?.message}
            label="Phone"
            labelPlacement="outside"
            placeholder="Enter phone number"
            size="md"
          />
          <CheckBox
            className="col-span-6 mt-3"
            defaultValue={watchUseForShipping}
            id="useForShipping"
            label="Billing address is same as shipping address"
            {...register("useForShipping")}
          />
        </div>

        {!watchUseForShipping && (
          <div className="my-7 grid grid-cols-6 gap-4">
            <InputText
              {...register("shipping.firstName", {
                required: "First name is required",
                pattern: {
                  value: IS_VALID_INPUT,
                  message: "Invalid First Name",
                },
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.firstName?.message}
              label="First Name"
              labelPlacement="outside"
              placeholder="Enter first name"
              size="md"
            />
            <InputText
              {...register("shipping.lastName", {
                required: "Last name is required",
                pattern: {
                  value: IS_VALID_INPUT,
                  message: "Invalid Last Name",
                },
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.lastName?.message}
              label="Last Name"
              labelPlacement="outside"
              placeholder="Enter last name"
              size="md"
            />
            <InputText
              {...register("shipping.companyName", {
                pattern: {
                  value: IS_VALID_INPUT,
                  message: "Invalid Company Name",
                },
              })}
              className="col-span-6 mb-4"
              errorMsg={errors?.shipping?.companyName?.message}
              label="Company Name"
              labelPlacement="outside"
              placeholder="Enter company name"
              showAsterisk={false}
              size="md"
            />
            <InputText
              {...register("shipping.address", {
                required: "Address field is required",
                pattern: {
                  value: IS_VALID_ADDRESS,
                  message: "Invalid Address",
                },
              })}
              className="col-span-6 mb-4"
              errorMsg={errors?.shipping?.address?.message}
              label="Street Address"
              labelPlacement="outside"
              placeholder="Enter street address"
              size="md"
            />
            <InputText
              {...register("shipping.country", {
                required: "Country field is required",
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.country?.message}
              label="Country"
              labelPlacement="outside"
              placeholder="Enter country"
              size="md"
            />
            <InputText
              {...register("shipping.state", {
                required: "State field is required",
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.state?.message}
              label="State"
              labelPlacement="outside"
              placeholder="Enter state"
              size="md"
            />
            <InputText
              {...register("shipping.city", {
                required: "City field is required",
                pattern: {
                  value: IS_VALID_INPUT,
                  message: "Invalid City",
                },
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.city?.message}
              label="City"
              labelPlacement="outside"
              placeholder="Enter city"
              size="md"
            />
            <InputText
              {...register("shipping.postcode", {
                required: "Postcode field is required",
                pattern: {
                  value: IS_VALID_INPUT,
                  message: "Invalid Postcode",
                },
              })}
              className="col-span-3 mb-4"
              errorMsg={errors?.shipping?.postcode?.message}
              label="Zip Code"
              labelPlacement="outside"
              placeholder="Enter zip code"
              size="md"
            />
            <InputText
              {...register("shipping.phone", {
                required: "Phone field is required",
                validate: (value) => {
                  const isValidFormat = /^\+?[0-9\s\-()]+$/.test(value);
                  if (!isValidFormat) {
                    return "Enter Valid Phone Number";
                  }
                  const digits = value.replace(/\D/g, "");
                  if (digits.length < 10) {
                    return "Phone number must contain at least 10 digits";
                  }
                  return true;
                },
              })}
              className="col-span-6"
              errorMsg={errors?.shipping?.phone?.message}
              label="Phone"
              labelPlacement="outside"
              placeholder="Enter phone number"
              size="md"
            />
          </div>
        )}

        <div className="justify-self-end">
          <ProceedToCheckout buttonName="Next" pending={isLoadingToSave} />
        </div>
      </form>
    );
  };

function AddressSummaryRow({
  label,
  address,
  rowClassName,
}: {
  label: string;
  address: MappedCheckoutAddress | null;
  rowClassName: string;
}) {
  return (
    <div className={rowClassName}>
      <p className="w-[184px] text-base font-normal text-black/60 dark:text-selected-white">
        {label}
      </p>
      <div className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg">
        <div className="flex flex-col">
          <p className="text-base font-medium">
            {`${address?.firstName || ""} ${address?.lastName || ""}`}
          </p>
          <p className="text-base font-medium text-zinc-500">
            {`${address?.companyName || ""}`}
          </p>
        </div>
        <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
          {`${address?.address || ""}, ${address?.postcode || ""}`}
        </p>
        <p className="text-zinc-500">
          {address?.city || ""} {address?.state || ""},{address?.country || ""}
        </p>
        <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
          {`T: ${address?.phone || ""}`}
        </p>
      </div>
    </div>
  );
}