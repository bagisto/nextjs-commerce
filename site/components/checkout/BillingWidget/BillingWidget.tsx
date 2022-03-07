import { FC } from 'react'
import s from './BillingWidget.module.css'
import { ChevronRight, CreditCard, Check, MapPin } from '@components/icons'

interface ComponentProps {
  onClick?: () => any
  isValid?: boolean
}

const AddressWidget: FC<ComponentProps> = ({ onClick, isValid }) => {
  return (
    <div onClick={onClick} className={s.root}>
      <div className="flex flex-1 items-center">
        <MapPin className="w-5 flex" />
        <span className="ml-5 text-sm text-center font-medium">
          Add Billing Address
        </span>
      </div>
      <div>{isValid ? <Check /> : <ChevronRight />}</div>
    </div>
  )
}

export default AddressWidget
