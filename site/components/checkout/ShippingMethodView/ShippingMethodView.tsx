import { FC, useEffect, useState } from 'react'

import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'

import useCheckout from '@framework/checkout/use-checkout'
import useAddShippingMethod from '@framework/checkout/use-add-shipping-method'
import s from './ShippingMethodView.module.css'

interface Form extends HTMLFormElement {
  shippingMethod: HTMLInputElement
}

const ShippingMethodView: FC = () => {
  const { setSidebarView } = useUI()

  const { data: checkoutData } = useCheckout()

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState('free_free')

  const addShippingMethod = useAddShippingMethod()

  useEffect(() => {
    if (checkoutData.selectedShippingMethod) {
      setSelectedShippingMethod(checkoutData.selectedShippingMethod.method)
    }
  }, [])

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await addShippingMethod({
      shippingMethod: selectedShippingMethod,
    })

    setSidebarView('CHECKOUT_VIEW')
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
        <div className="px-4 sm:px-6 flex-1">
          <Text variant="sectionHeading">Shipping Method</Text>
          {checkoutData?.shippingMethods?.map((shippingMethod: any) => {
            return (
              <div
                className="flex flex-row my-3 items-center"
                key={shippingMethod.methods.code}
              >
                <input
                  name="shippingMethod"
                  value={shippingMethod.methods.code}
                  className={s.radio}
                  type="radio"
                  checked={
                    shippingMethod.methods.code == selectedShippingMethod
                  }
                  onChange={(event) =>
                    setSelectedShippingMethod(event.target.value)
                  }
                />
                <span className="ml-3 text-sm">
                  {shippingMethod.title} (
                  {shippingMethod.methods.formattedPrice})
                </span>
              </div>
            )
          })}
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

export default ShippingMethodView
