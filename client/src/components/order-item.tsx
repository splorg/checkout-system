import { FC } from 'react'
import { IOrderItem } from '../services/order/types'
import { formatCurrency, formatCustomDate, formatTime } from '../utils'

interface Props {
  item: IOrderItem
  date: string
  total: number
}

export const OrderItem: FC<Props> = ({ item, date, total }) => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='font-paytone-regular border-2 h-[50px] w-[50px] flex items-center justify-center rounded-lg border-[#A3A3A3]'>  
        {item.quantity}
      </div>

      <div className='flex flex-col justify-center'>
        <span className='font-bold'>{item.productName}</span>
        <span className='text-xs text-[#A3A3A3]'>
          <b>{formatCustomDate(date)}</b> às {formatTime(date)}
        </span>
        <span className='font-bold text-xs text-primary-green'>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
