import { FC, useEffect, useState } from 'react'
import cn from 'clsx'

import Button from '@components/ui/Button'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'

import useCart from '@framework/cart/use-cart'
import useAddAddresses from '@framework/checkout/use-add-addresses'

import s from './AddressView.module.css'

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

const addressDefaultValues = {
  company: '',
  firstName: '',
  lastName: '',
  email: '',
  streetAddress: '',
  city: '',
  country: 'IN',
  state: 'DL',
  zipCode: '',
  phone: '',
}

const AddressView: FC = () => {
  const { setSidebarView } = useUI()

  const { data: cartData, mutate: refreshCart } = useCart()

  const [checkoutAddresses, setCheckoutAddresses] = useState({
    billing: {
      ...addressDefaultValues,
      useForShipping: true,
    },
    shipping: {
      ...addressDefaultValues,
    },
  })

  const addAddress = useAddAddresses()

  useEffect(() => {
    setCheckoutAddresses(cartData.addresses)
  }, [])

  function updateCheckoutAddressField(
    event: any,
    addressType: string,
    key: string
  ) {
    let updatedCheckoutAddresses: any = { ...checkoutAddresses }

    if (key === 'useForShipping') {
      updatedCheckoutAddresses[addressType][key] =
        event.target.value === 'true' ? true : false
    } else {
      updatedCheckoutAddresses[addressType][key] = event.target.value
    }

    setCheckoutAddresses(updatedCheckoutAddresses)
  }

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await addAddress({
      addresses: checkoutAddresses,
    })

    setSidebarView('CHECKOUT_VIEW')
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
              <input
                name="billingCompany"
                value={checkoutAddresses.billing.company}
                className={s.input}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'company')
                }
              />
            </div>
            <div className="grid gap-3 grid-flow-row grid-cols-12">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>First Name</label>
                <input
                  name="billingFirstName"
                  value={checkoutAddresses.billing.firstName}
                  className={s.input}
                  onChange={(event) =>
                    updateCheckoutAddressField(event, 'billing', 'firstName')
                  }
                />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>Last Name</label>
                <input
                  name="billingLastName"
                  value={checkoutAddresses.billing.lastName}
                  className={s.input}
                  onChange={(event) =>
                    updateCheckoutAddressField(event, 'billing', 'lastName')
                  }
                />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Email</label>
              <input
                name="billingEmail"
                value={checkoutAddresses.billing.email}
                className={s.input}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'email')
                }
              />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Street Address</label>
              <input
                name="billingStreetAddress"
                value={checkoutAddresses.billing.streetAddress}
                className={s.input}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'streetAddress')
                }
              />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>City</label>
              <input
                name="billingCity"
                value={checkoutAddresses.billing.city}
                className={s.input}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'city')
                }
              />
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Country</label>
              <select
                name="billingCountry"
                className={s.select}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'country')
                }
              >
                <option value="IN">India</option>
              </select>
            </div>
            <div className="grid gap-3 grid-flow-row grid-cols-12">
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>State</label>
                <input
                  name="billingState"
                  value={checkoutAddresses.billing.state}
                  className={s.input}
                  onChange={(event) =>
                    updateCheckoutAddressField(event, 'billing', 'state')
                  }
                />
              </div>
              <div className={cn(s.fieldset, 'col-span-6')}>
                <label className={s.label}>Zip Code</label>
                <input
                  name="billingZipCode"
                  value={checkoutAddresses.billing.zipCode}
                  className={s.input}
                  onChange={(event) =>
                    updateCheckoutAddressField(event, 'billing', 'zipCode')
                  }
                />
              </div>
            </div>
            <div className={s.fieldset}>
              <label className={s.label}>Phone</label>
              <input
                name="billingPhone"
                value={checkoutAddresses.billing.phone}
                className={s.input}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'phone')
                }
              />
            </div>
            <div className="flex flex-row my-3 items-center">
              <input
                name="billingUseForShipping"
                value="true"
                className={s.radio}
                type="radio"
                checked={checkoutAddresses.billing.useForShipping}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'useForShipping')
                }
              />
              <span className="ml-3 text-sm">Ship to this address</span>
            </div>
            <div className="flex flex-row my-3 items-center">
              <input
                name="billingUseForShipping"
                value="false"
                className={s.radio}
                type="radio"
                checked={!checkoutAddresses.billing.useForShipping}
                onChange={(event) =>
                  updateCheckoutAddressField(event, 'billing', 'useForShipping')
                }
              />
              <span className="ml-3 text-sm">
                Use a different shipping address
              </span>
            </div>
          </div>
        </div>

        {!checkoutAddresses.billing.useForShipping && (
          <>
            <hr className="border-accent-2 my-6" />

            <div className="px-4 sm:px-6 flex-1">
              <h2 className="pt-1 pb-8 text-2xl font-semibold tracking-wide cursor-pointer inline-block">
                Shipping Address
              </h2>
              <div>
                <div>
                  <div className={s.fieldset}>
                    <label className={s.label}>Company (Optional)</label>
                    <input
                      name="shippingCompany"
                      value={checkoutAddresses.shipping.company}
                      className={s.input}
                      onChange={(event) =>
                        updateCheckoutAddressField(event, 'shipping', 'company')
                      }
                    />
                  </div>
                  <div className="grid gap-3 grid-flow-row grid-cols-12">
                    <div className={cn(s.fieldset, 'col-span-6')}>
                      <label className={s.label}>First Name</label>
                      <input
                        name="shippingFirstName"
                        value={checkoutAddresses.shipping.firstName}
                        className={s.input}
                        onChange={(event) =>
                          updateCheckoutAddressField(
                            event,
                            'shipping',
                            'firstName'
                          )
                        }
                      />
                    </div>
                    <div className={cn(s.fieldset, 'col-span-6')}>
                      <label className={s.label}>Last Name</label>
                      <input
                        name="shippingLastName"
                        value={checkoutAddresses.shipping.lastName}
                        className={s.input}
                        onChange={(event) =>
                          updateCheckoutAddressField(
                            event,
                            'shipping',
                            'lastName'
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={s.fieldset}>
                    <label className={s.label}>Email</label>
                    <input
                      name="shippingEmail"
                      value={checkoutAddresses.shipping.email}
                      className={s.input}
                      onChange={(event) =>
                        updateCheckoutAddressField(event, 'shipping', 'email')
                      }
                    />
                  </div>
                  <div className={s.fieldset}>
                    <label className={s.label}>Street Address</label>
                    <input
                      name="shippingStreetAddress"
                      value={checkoutAddresses.shipping.streetAddress}
                      className={s.input}
                      onChange={(event) =>
                        updateCheckoutAddressField(
                          event,
                          'shipping',
                          'streetAddress'
                        )
                      }
                    />
                  </div>
                  <div className={s.fieldset}>
                    <label className={s.label}>City</label>
                    <input
                      name="shippingCity"
                      value={checkoutAddresses.shipping.city}
                      className={s.input}
                      onChange={(event) =>
                        updateCheckoutAddressField(event, 'shipping', 'city')
                      }
                    />
                  </div>
                  <div className={s.fieldset}>
                    <label className={s.label}>Country</label>
                    <select
                      name="shippingCountry"
                      className={s.select}
                      onChange={(event) =>
                        updateCheckoutAddressField(event, 'shipping', 'country')
                      }
                    >
                      <option>India</option>
                    </select>
                  </div>
                  <div className="grid gap-3 grid-flow-row grid-cols-12">
                    <div className={cn(s.fieldset, 'col-span-6')}>
                      <label className={s.label}>State</label>
                      <input
                        name="shippingState"
                        value={checkoutAddresses.shipping.state}
                        className={s.input}
                        onChange={(event) =>
                          updateCheckoutAddressField(event, 'shipping', 'state')
                        }
                      />
                    </div>
                    <div className={cn(s.fieldset, 'col-span-6')}>
                      <label className={s.label}>Zip Code</label>
                      <input
                        name="shippingZipCode"
                        value={checkoutAddresses.shipping.zipCode}
                        className={s.input}
                        onChange={(event) =>
                          updateCheckoutAddressField(
                            event,
                            'shipping',
                            'zipCode'
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className={s.fieldset}>
                    <label className={s.label}>Phone</label>
                    <input
                      name="shippingPhone"
                      value={checkoutAddresses.shipping.phone}
                      className={s.input}
                      onChange={(event) =>
                        updateCheckoutAddressField(event, 'shipping', 'phone')
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="sticky z-20 bottom-0 w-full right-0 left-0 py-12 bg-accent-0 border-t border-accent-2 px-6">
          <Button type="submit" width="100%" variant="ghost">
            Continue
          </Button>
        </div>
      </SidebarLayout>
    </form>
  )
}

export default AddressView
