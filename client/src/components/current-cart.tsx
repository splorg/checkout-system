import { useEventStore } from '../stores/event-store'
import { useGetCurrentCart } from '../hooks/queries/useGetCurrentCart'
import { TEST_USER_ID } from '../constants'
import { CartItem } from './cart-item'

export const CurrentCart = () => {
  const currentEvent = useEventStore((state) => state.currentEvent)
  const { data } = useGetCurrentCart(TEST_USER_ID, currentEvent)

  if (!data?.cart) {
    return (
      <div className='flex items-center justify-center size-full'>
        <p className="font-semibold text-[#656565] text-sm">Carrinho vazio.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-scroll">
      {data.cart.items.map((item) => (
        <CartItem key={item.productId} item={item} />
      ))}
    </div>
  )
}
