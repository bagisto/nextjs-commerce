'use client';
import { Checkbox } from '@heroui/checkbox';
import { createCheckoutAddress } from 'components/checkout/action';
import RegionDropDown from 'components/checkout/region-drop-down';
import { CountryArrayDataType, ShippingAddressDataType } from 'lib/bagisto/types';
import { useFormState } from 'react-dom';
import InputText from '../cart/input';
import { ProceedToCheckout } from '../cart/proceed-to-checkout';
import SelectBox from '../select-box';
const GuestCheckOutForm = ({
  countries,
  shippingAddress
}: {
  countries: CountryArrayDataType[];
  shippingAddress?: ShippingAddressDataType;
}) => {
  const initialState = {
    ...(shippingAddress || {})
  };
  const [state, formAction] = useFormState(createCheckoutAddress, initialState);

  return (
    <form action={formAction} className="my-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Contact</h1>
        <InputText
          className="max-w-full"
          name="email"
          defaultValue={initialState?.email}
          errorMsg={state?.errors?.email}
          label="Enter Email *"
        />
        <Checkbox defaultSelected className="" color="primary">
          <span className="text-neutral-400 dark:text-white">Email me with news and offers</span>
        </Checkbox>
      </div>
      <div className="my-7 grid grid-cols-6 gap-4">
        <h1 className="col-span-6 text-2xl font-bold">Shipping address</h1>
        <InputText
          className="col-span-3"
          name="firstName"
          defaultValue={initialState?.firstName}
          errorMsg={state?.errors?.firstName}
          label="First Name *"
        />
        <InputText
          className="col-span-3"
          name="lastName"
          defaultValue={initialState?.lastName}
          errorMsg={state?.errors?.lastName}
          label="Last Name *"
        />
        <InputText
          className="col-span-6"
          name="companyName"
          defaultValue={initialState?.companyName}
          label="Company Name"
        />
        <InputText
          className="col-span-6"
          name="address"
          label="Street Address *"
          defaultValue={initialState?.address}
          errorMsg={state?.errors?.address}
        />
        <SelectBox
          countries={countries}
          className="col-span-3"
          nameAttr="country"
          defaultValue={'AI'}
          errorMsg={state?.errors?.country?.join(', ')}
          label="Country/Region *"
        />
        <RegionDropDown
          countries={countries}
          errorMsg={state?.errors?.state}
          defaultValue={''}
          className="col-span-3 sm:col-span-3"
          label="State *"
        />
        <InputText
          className="col-span-3"
          name="city"
          label="City *"
          defaultValue={initialState?.city}
          errorMsg={state?.errors?.city}
        />
        <InputText
          className="col-span-3"
          name="postcode"
          defaultValue={initialState?.postcode}
          label="Zip Code *"
          errorMsg={state?.errors?.postcode}
        />
        <InputText
          className="col-span-6"
          name="phone"
          label="Phone *"
          defaultValue={initialState?.phone}
          errorMsg={state?.errors?.phone}
        />

        <Checkbox
          defaultSelected={shippingAddress?.defaultAddress}
          className="col-span-6"
          color="primary"
        >
          <span className="text-neutral-400 dark:text-white">Use same address for shipping</span>
        </Checkbox>
        <div className="col-span-6 flex w-full justify-end">
          <div className="w-full sm:w-2/5">
            <ProceedToCheckout buttonName="Continue to shipping" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default GuestCheckOutForm;
