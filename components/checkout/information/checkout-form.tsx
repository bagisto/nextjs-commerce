'use client';
import dynamic from 'next/dynamic';
import { Checkbox } from '@nextui-org/react';
import { createCheckoutAddress } from 'components/checkout/action';
import { CountryArrayDataType } from 'lib/bagisto/types';
import { SAVED_LOCAL_STORAGE } from 'lib/constants';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { createCheckoutProcess, getLocalStorage, setLocalStorage } from '../../../lib/utils';
const RegionDropDown = dynamic(() => import('components/checkout/region-drop-down'), { ssr: false });
const InputText = dynamic(() => import('../cart/input'), { ssr: false });
const ProceedToCheckout = dynamic(() => import('../cart/proceed-to-checkout'), { ssr: false });
const SelectBox = dynamic(() => import('../select-box'), { ssr: false });
const GuestCheckOutForm = ({ countries }: { countries: CountryArrayDataType[] }) => {
  const [isSaved, setFormData] = useState(false);
  const values = getLocalStorage(SAVED_LOCAL_STORAGE, true);
  const initialState = {
    ...values?.shipping
  };
  const [state, formAction] = useFormState(createCheckoutAddress, initialState);
  useEffect(() => {
    if (state?.shippingAddress) {
      createCheckoutProcess(state);
      if (isSaved) {
        setLocalStorage(SAVED_LOCAL_STORAGE, { ...state?.shippingAddress, isSaved });
      } else {
        localStorage.removeItem(SAVED_LOCAL_STORAGE);
      }
      redirect('/checkout/shipping');
    }
  }, [state, isSaved]);
  return (
    <form action={formAction} className="my-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Contact</h1>
        <InputText
          className="max-w-full"
          name="email"
          defaultValue={initialState?.email}
          errorMsg={state?.errors?.email}
          label="Enter Email"
        />
        <Checkbox defaultSelected className="" color="primary">
          <span className="text-neutral-400 dark:text-white">Email me with news and offers</span>
        </Checkbox>
      </div>
      <div className="my-7 grid grid-cols-6 gap-4">
        <h1 className="col-span-6 text-2xl font-bold">Shipping address</h1>
        <SelectBox
          countries={countries}
          className="col-span-6"
          nameAttr="country"
          defaultValue={state?.country}
          errorMsg={state?.errors?.country?.join(', ')}
          label="Country/Region"
        />
        <InputText
          className="col-span-3"
          name="firstName"
          defaultValue={initialState?.firstName}
          errorMsg={state?.errors?.firstName}
          label="First Name"
        />
        <InputText
          className="col-span-3"
          name="lastName"
          defaultValue={initialState?.lastName}
          label="Last Name"
        />
        <InputText
          className="col-span-6"
          name="address1"
          defaultValue={initialState?.address1}
          label="Address"
          errorMsg={state?.errors?.address1}
        />
        <InputText
          className="col-span-6"
          name="address2"
          label="Apartment, suite, etc. (optional)"
          defaultValue={initialState?.address2}
        />
        <InputText
          className="col-span-6"
          name="phone"
          label="Phone"
          defaultValue={initialState?.phone}
          errorMsg={state?.errors?.phone}
        />
        <InputText
          className="col-span-6 sm:col-span-2"
          name="city"
          label="City"
          defaultValue={initialState?.city}
          errorMsg={state?.errors?.city}
        />
        <RegionDropDown
          countries={countries}
          errorMsg={state?.errors?.state}
          defaultValue={state?.state}
          className="col-span-3 sm:col-span-2"
          label="State"
        />
        <InputText
          className="col-span-3 sm:col-span-2"
          name="postcode"
          defaultValue={initialState?.postcode}
          label="Zip Code"
          errorMsg={state?.errors?.postcode}
        />

        <Checkbox
          onChange={(e) => setFormData(e.target.checked)}
          defaultSelected={values?.isSaved}
          className="col-span-6"
          color="primary"
        >
          <span className="text-neutral-400 dark:text-white">
            Save this information for next time
          </span>
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
