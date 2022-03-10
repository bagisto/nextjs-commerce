import { FC } from 'react'

import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'

import useAddPaymentMethod from '@framework/checkout/use-add-payment-method'
import s from './PaymentMethodView.module.css'

interface Form extends HTMLFormElement {
  paymentMethod: HTMLInputElement
}

const PaymentMethodView: FC = () => {
  const { setSidebarView } = useUI()
  const addPaymentMethod = useAddPaymentMethod()

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    await addPaymentMethod({
      paymentMethod: event.target.paymentMethod.value,
    })

    setSidebarView('CHECKOUT_VIEW')
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
        <div className="px-4 sm:px-6 flex-1">
          <Text variant="sectionHeading">Payment Method</Text>
          <div>
            <div className="flex flex-row my-3 items-center">
              <input
                name="paymentMethod"
                value="cashondelivery"
                className={s.radio}
                type="radio"
              />
              <span className="ml-3 text-sm">Cash On Delivery</span>
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

export default PaymentMethodView
