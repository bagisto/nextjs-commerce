import FormPlaceHolder from 'components/checkout/place-holder';
import { getCountryList } from 'lib/bagisto';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const GuestCheckOutForm = dynamic(() => import('components/checkout/information/checkout-form'), {
  loading: () => <FormPlaceHolder />,
  ssr: false
});
export default async function Information() {
  const countryList = await getCountryList();
  return <GuestCheckOutForm countries={countryList} />;
}
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout with store items'
};
