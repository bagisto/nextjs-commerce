import { FC } from 'react'
import cn from 'clsx'

import Button from '@components/ui/Button'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import useAddAddress from '@framework/customer/address/use-add-item'

import s from './BillingView.module.css'

interface Form extends HTMLFormElement {
  /**
   * Billing.
   */
  billingCompany: HTMLInputElement
  billingFirstName: HTMLInputElement
  billingLastName: HTMLInputElement
  billingEmail: HTMLInputElement
  billingStreetAddress: HTMLInputElement
  billingCity: HTMLInputElement
  billingCountry: HTMLSelectElement
  billingState: HTMLSelectElement
  billingZipCode: HTMLInputElement
  billingPhone: HTMLInputElement
  billingUseForShipping: HTMLInputElement

  /**
   * Shipping.
   */
  shippingCompany: HTMLInputElement
  shippingFirstName: HTMLInputElement
  shippingLastName: HTMLInputElement
  shippingEmail: HTMLInputElement
  shippingStreetAddress: HTMLInputElement
  shippingCity: HTMLInputElement
  shippingCountry: HTMLSelectElement
  shippingState: HTMLSelectElement
  shippingZipCode: HTMLInputElement
  shippingPhone: HTMLInputElement
}

const BillingView: FC = () => {
  const { setSidebarView } = useUI()

  const addAddress = useAddAddress()

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await addAddress({
      /**
       * Billing.
       */
      billingCompany: event.target.billingCompany.value,
      billingFirstName: event.target.billingFirstName.value,
      billingLastName: event.target.billingLastName.value,
      billingEmail: event.target.billingEmail.value,
      billingStreetAddress: event.target.billingStreetAddress.value,
      billingCity: event.target.billingCity.value,
      billingCountry: event.target.billingCountry.value,
      billingState: event.target.billingState.value,
      billingZipCode: event.target.billingZipCode.value,
      billingPhone: event.target.billingPhone.value,
      billingUseForShipping: event.target.billingUseForShipping.value,

      /**
       * Shipping.
       */
      shippingCompany: event.target.shippingCompany.value,
      shippingFirstName: event.target.shippingFirstName.value,
      shippingLastName: event.target.shippingLastName.value,
      shippingEmail: event.target.shippingEmail.value,
      shippingStreetAddress: event.target.shippingStreetAddress.value,
      shippingCity: event.target.shippingCity.value,
      shippingCountry: event.target.shippingCountry.value,
      shippingState: event.target.shippingState.value,
      shippingZipCode: event.target.shippingZipCode.value,
      shippingPhone: event.target.shippingPhone.value,
    })

    // setSidebarView('CHECKOUT_VIEW')
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
        <div className="px-4 sm:px-6 flex-1">
          <h2 className="pt-1 pb-8 text-2xl font-semibold tracking-wide cursor-pointer inline-block">
            Billing Address
          </h2>
          <div>
            <div className={s.fieldset}>
              <label className={s.label}>Company (Optional)</label>
              <input name="billingCompany" className={s.input} />
            </div>
            <div className="grid gap-3 grid-flow-row grid-cols-12">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>First Name</label>
                <input name="billingFirstName" className={s.input} />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>Last Name</label>
                <input name="billingLastName" className={s.input} />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Email</label>
              <input name="billingEmail" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Street Address</label>
              <input name="billingStreetAddress" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>City</label>
              <input name="billingCity" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Country</label>
              <select name="billingCountry" className={s.select}>
                <option value="IN">India</option>
              </select>
            </div>
            <div className="grid gap-3 grid-flow-row grid-cols-12">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>State</label>
                <input name="billingState" value="DL" className={s.input} />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>Zip Code</label>
                <input name="billingZipCode" className={s.input} />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Phone</label>
              <input name="billingPhone" className={s.input} />
            </div>
            <div className="flex flex-row my-3 items-center">
              <input
                name="billingUseForShipping"
                value="true"
                className={s.radio}
                type="radio"
              />
              <span className="ml-3 text-sm">Ship to this address</span>
            </div>
            <div className="flex flex-row my-3 items-center">
              <input
                name="billingUseForShipping"
                value="false"
                className={s.radio}
                type="radio"
              />
              <span className="ml-3 text-sm">
                Use a different shipping address
              </span>
            </div>
          </div>
        </div>
        <hr className="border-accent-2 my-6" />
        <div className="px-4 sm:px-6 flex-1">
          <h2 className="pt-1 pb-8 text-2xl font-semibold tracking-wide cursor-pointer inline-block">
            Shipping Address
          </h2>
          <div>
            <div>
              <div className={s.fieldset}>
                <label className={s.label}>Company (Optional)</label>
                <input name="shippingCompany" className={s.input} />
              </div>
              <div className="grid gap-3 grid-flow-row grid-cols-12">
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>First Name</label>
                  <input name="shippingFirstName" className={s.input} />
                </div>
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>Last Name</label>
                  <input name="shippingLastName" className={s.input} />
                </div>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Email</label>
                <input name="shippingEmail" className={s.input} />
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Street Address</label>
                <input name="shippingStreetAddress" className={s.input} />
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>City</label>
                <input name="shippingCity" className={s.input} />
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Country</label>
                <select name="shippingCountry" className={s.select}>
                  <option>India</option>
                </select>
              </div>
              <div className="grid gap-3 grid-flow-row grid-cols-12">
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>State</label>
                  <input name="shippingState" className={s.input} />
                </div>
                <div className={cn(s.fieldset, 'col-span-6')}>
                  <label className={s.label}>Zip Code</label>
                  <input name="shippingZipCode" className={s.input} />
                </div>
              </div>
              <div className={s.fieldset}>
                <label className={s.label}>Phone</label>
                <input name="shippingPhone" className={s.input} />
              </div>
            </div>
          </div>
        </div>
        <div className="sticky z-20 bottom-0 w-full right-0 left-0 py-12 bg-accent-0 border-t border-accent-2 px-6">
          <Button type="submit" width="100%" variant="ghost">
            Continue
          </Button>
        </div>
      </SidebarLayout>
    </form>
  )
}

export default BillingView
