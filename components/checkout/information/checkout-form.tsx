'use client';
import { Checkbox } from '@nextui-org/react';
import { createCheckoutAddress } from 'components/checkout/action';
import RegionDropDown from 'components/checkout/region-drop-down';
import { CountryArrayDataType } from 'lib/bagisto/types';
import { createCheckoutProceess, setLocalStorage } from 'lib/utils';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { getLocalStorage } from '../../../lib/utils';
import InputText from '../cart/input';
import { ProceedToCheckout } from '../cart/proceed-to-checkout';
import Selectbox from '../select-box';

const GuestCheckOutForm = ({ countries }: { countries: CountryArrayDataType[] }) => {
  const values = getLocalStorage('shippingAddress', true);
  const initialState = {
    ...values?.shipping
  };
  const [state, formAction] = useFormState(createCheckoutAddress, initialState);
  useEffect(() => {
    if (state?.shippingAddress) {
      createCheckoutProceess(state);
      setLocalStorage('shippingAddress', state?.shippingAddress);
      redirect('/checkout/shipping');
    }
  }, [state]);

  return (
    <form action={formAction} className="my-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Contact</h1>
        <InputText
          className="max-w-full"
          name="email"
          defaultValue={state.email}
          errorMsg={state?.errors?.email?.join(', ')}
          label="Enter Email"
        />
        <Checkbox defaultSelected className="" color="primary">
          <span className="text-neutral-400 dark:text-white">Email me with news and offers</span>
        </Checkbox>
      </div>
      <div className="my-7 grid grid-cols-6 gap-4">
        <h1 className="col-span-6 text-2xl font-bold ">Shipping address</h1>
        <Selectbox
          countries={countries}
          className="col-span-6"
          nameAttr="country"
          defaultvalue={state?.country}
          errorMsg={state?.errors?.country?.join(', ')}
          label="Country/Region"
        />
        <InputText
          className="col-span-3"
          name="firstName"
          defaultValue={state.firstName}
          errorMsg={state?.errors?.firstName?.join(', ')}
          label="First Name"
        />
        <InputText
          className="col-span-3"
          name="lastName"
          defaultValue={state.lastName}
          label="Last Name"
        />
        <InputText
          className="col-span-6"
          name="address1"
          label="Address"
          defaultValue={state.address1}
          errorMsg={state?.errors?.address1?.join(', ')}
        />
        <InputText
          className="col-span-6"
          name="address2"
          label="Apartment, suite, etc. (optional)"
        />
        <InputText
          className="col-span-6"
          name="phone"
          label="Phone"
          defaultValue={state.phone}
          errorMsg={state?.errors?.phone?.join(', ')}
        />
        <InputText
          className="col-span-6 sm:col-span-2"
          name="city"
          label="City"
          defaultValue={state.city}
          errorMsg={state?.errors?.city?.join(', ')}
        />
        <RegionDropDown
          countries={countries}
          errorMsg={state?.errors?.state?.join(', ')}
          defaultValue={state?.state}
          className="col-span-3 sm:col-span-2"
          label="State"
        />
        <InputText
          className="col-span-3 sm:col-span-2"
          name="postcode"
          defaultValue={state.postcode}
          label="Zip Code"
          errorMsg={state?.errors?.postcode?.join(', ')}
        />

        <Checkbox className="col-span-6" color="primary">
          <span className="text-neutral-400 dark:text-white">
            Save this information for next time
          </span>
        </Checkbox>
        <div className="col-span-6 flex w-full justify-end ">
          <div className="w-full sm:w-2/5">
            <ProceedToCheckout buttonName="Continue to shipping" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default GuestCheckOutForm;
