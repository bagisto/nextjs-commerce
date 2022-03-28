import { Logo } from '@components/ui'

const OrderSuccessView: React.FC = () => {
  return (
    <div>
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-3">
        <p>Your order has been placed successfully!</p>
      </div>
    </div>
  )
}

export default OrderSuccessView
