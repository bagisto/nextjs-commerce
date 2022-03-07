import { FC } from 'react'
import cn from 'clsx'

import Button from '@components/ui/Button'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import useAddAddress from '@framework/customer/address/use-add-item'

import s from './BillingView.module.css'

interface Form extends HTMLFormElement {
  company: HTMLInputElement
  firstName: HTMLInputElement
  lastName: HTMLInputElement
  email: HTMLInputElement
  streetAddress: HTMLInputElement
  city: HTMLInputElement
  country: HTMLSelectElement
  state: HTMLSelectElement
  zipCode: HTMLInputElement
  phone: HTMLInputElement
}

const BillingView: FC = () => {
  const { setSidebarView } = useUI()
  // const addAddress = useAddAddress()

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    console.log({
      company: event.target.company.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      streetAddress: event.target.streetAddress.value,
      city: event.target.city.value,
      country: event.target.country.value,
      state: event.target.state.value,
      zipCode: event.target.zipCode.value,
      phone: event.target.phone.value,
    })

    // await addAddress({
    //   type: event.target.type.value,
    //   company: event.target.company.value,
    //   firstName: event.target.firstName.value,
    //   lastName: event.target.lastName.value,
    //   email: event.target.email.value,
    //   streetAddress: event.target.streetAddress.value,
    //   city: event.target.city.value,
    //   country: event.target.country.value,
    //   state: event.target.state.value,
    //   zipCode: event.target.zipCode.value,
    //   phone: event.target.phone.value,
    // })

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
              <input name="company" className={s.input} />
            </div>
            <div className="grid gap-3 grid-flow-row grid-cols-12">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>First Name</label>
                <input name="firstName" className={s.input} />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>Last Name</label>
                <input name="lastName" className={s.input} />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Email</label>
              <input name="email" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Street Address</label>
              <input name="streetAddress" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>City</label>
              <input name="city" className={s.input} />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Country</label>
              <select name="country" className={s.select}>
                <option>India</option>
              </select>
            </div>
            <div className="grid gap-3 grid-flow-row grid-cols-12">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>State</label>
                <input name="state" className={s.input} />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>Zip Code</label>
                <input name="zipCode" className={s.input} />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Phone</label>
              <input name="phone" className={s.input} />
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
