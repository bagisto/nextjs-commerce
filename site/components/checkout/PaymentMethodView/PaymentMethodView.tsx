import { FC, useEffect, useState } from 'react'

import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'

import useCheckout from '@framework/checkout/use-checkout'
import useAddPaymentMethod from '@framework/checkout/use-add-payment-method'
import s from './PaymentMethodView.module.css'

interface Form extends HTMLFormElement {
  paymentMethod: HTMLInputElement
}

const PaymentMethodView: FC = () => {
  const { setSidebarView } = useUI()

  const { data: checkoutData } = useCheckout()

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('cashondelivery')

  const addPaymentMethod = useAddPaymentMethod()

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await addPaymentMethod({
      paymentMethod: selectedPaymentMethod,
    })

    setSidebarView('CHECKOUT_VIEW')
  }

  useEffect(() => {
    if (checkoutData.selectedPaymentMethod) {
      setSelectedPaymentMethod(checkoutData.selectedPaymentMethod.method)
    }
  }, [])

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
        <div className="px-4 sm:px-6 flex-1">
          <Text variant="sectionHeading">Payment Method</Text>
          {checkoutData?.paymentMethods?.map((paymentMethod: any) => {
            return (
              <div
                className="flex flex-row my-3 items-center"
                key={paymentMethod.method}
              >
                <input
                  name="paymentMethod"
                  value={paymentMethod.method}
                  className={s.radio}
                  type="radio"
                  checked={paymentMethod.method == selectedPaymentMethod}
                  onChange={(event) =>
                    setSelectedPaymentMethod(event.target.value)
                  }
                />
                <span className="ml-3 text-sm">
                  {paymentMethod.method_title}
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

export default PaymentMethodView
