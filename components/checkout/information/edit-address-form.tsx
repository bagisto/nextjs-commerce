import { FC, useActionState, useEffect } from "react";
import { Checkbox } from "@heroui/checkbox";

import { updateAddress } from "../action";
import InputText from "../cart/input";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";
import SelectBox from "../select-filed";

import RegionDropDown from "@/components/checkout/region-drop-down";
import { AddressDataTypes, CountryArrayDataType } from "@/lib/bagisto/types";
import { isObject } from "@/lib/type-guards";

interface EditAddressFormProps {
  shippingAdress: AddressDataTypes;
  setItem: any;
  countries: CountryArrayDataType[];
}
const EditAddressForm: FC<EditAddressFormProps> = ({
  shippingAdress,
  setItem,
  countries,
}) => {
  const initialState = {
    ...shippingAdress,
  };

  const [state, formAction] = useActionState(updateAddress, null);

  useEffect(() => {
    if (isObject(state?.data) && state?.data?.success) {
      setItem({
        type: "Billing",
        state: false,
        address: shippingAdress,
      });
    }
  }, [state, shippingAdress, setItem]);

  return (
    <>
      <form action={formAction} className="my-5">
        <div className="">
          <InputText
            className="max-w-full"
            name="email"
            defaultValue={initialState?.email}
            // errorMsg={state?.errors?.email}
            label="Enter Email *"
          />
          <input name="id" type="hidden" value={initialState.id} />
        </div>

        <div className="my-7 grid grid-cols-6 gap-4">
          <InputText
            className="col-span-3"
            name="firstName"
            defaultValue={initialState?.firstName}
            // errorMsg={state?.errors?.firstName}
            label="First Name *"
          />
          <InputText
            className="col-span-3"
            name="lastName"
            defaultValue={initialState?.lastName}
            // errorMsg={state?.errors?.lastName}
            label="Last Name *"
          />
          <InputText
            className="col-span-6"
            defaultValue={initialState?.companyName}
            label="Company Name"
            name="companyName"
          />
          <InputText
            className="col-span-6"
            label="Street Address *"
            name="address"
            defaultValue={initialState?.address}
            // errorMsg={state?.errors?.address}
          />

          <SelectBox
            className="col-span-3"
            countries={countries}
            nameAttr="country"
            // defaultValue={'AI'}
            // errorMsg={state?.errors?.country}
            label="Country/Region *"
          />
          <RegionDropDown
            className="col-span-3 sm:col-span-3"
            label="State *"
            name="state"
            countries={countries}
            // errorMsg={state?.errors?.state}
            defaultValue={initialState.state}
          />
          <InputText
            className="col-span-3"
            label="City *"
            name="city"
            defaultValue={initialState?.city}
            // errorMsg={state?.errors?.city}
          />
          <InputText
            className="col-span-3"
            defaultValue={initialState?.postcode}
            name="postcode"
            label="Zip Code *"
            // errorMsg={state?.errors?.postcode}
          />
          <InputText
            className="col-span-6"
            label="Phone *"
            name="phone"
            defaultValue={initialState?.phone}
            // errorMsg={state?.errors?.phone}
          />
          <Checkbox
            name="saveAddress"
            // value={disabledKeys ? 'true' : 'false'}
            // isSelected={Boolean(disabledKeys.at(0))}
            // onValueChange={toggleDisableSecondAccordion}
            className="col-span-6"
            color="primary"
          >
            <span className="text-neutral-400 dark:text-white">
              Save this to address book
            </span>
          </Checkbox>
        </div>
        <div className="justify-self-end">
          <ProceedToCheckout buttonName="Next" pending={false} />
        </div>
      </form>
    </>
  );
};

export default EditAddressForm;
