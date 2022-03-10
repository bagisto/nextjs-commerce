import { FC } from 'react'

import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'

import useAddShippingMethod from '@framework/checkout/use-add-shipping-method'
import s from './ShippingMethodView.module.css'

interface Form extends HTMLFormElement {
  shippingMethod: HTMLInputElement
}

const ShippingMethodView: FC = () => {
  const { setSidebarView } = useUI()
  const addShippingMethod = useAddShippingMethod()

  async function handleSubmit(event: React.ChangeEvent<Form>) {
    event.preventDefault()

    console.log({
      shippingMethod: event.target.shippingMethod.value,
    })

    await addShippingMethod({
      shippingMethod: event.target.shippingMethod.value,
    })

    // setSidebarView('CHECKOUT_VIEW')
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <SidebarLayout handleBack={() => setSidebarView('CHECKOUT_VIEW')}>
        <div className="px-4 sm:px-6 flex-1">
          <Text variant="sectionHeading">Payment Method</Text>
          <div>
            <div className="flex flex-row my-3 items-center">
              <input
                name="shippingMethod"
                value="free_free"
                className={s.radio}
                type="radio"
              />
              <span className="ml-3 text-sm">Free Shipping</span>
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

export default ShippingMethodView
