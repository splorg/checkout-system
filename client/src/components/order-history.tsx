import { useGetHistory } from "../hooks/queries/useGetHistory"
import { TEST_USER_ID } from "../constants"
import { Loading } from "./loading"
import { OrderItem } from "./order-item"

export const OrderHistory = () => {
  const { data, isLoading } = useGetHistory(TEST_USER_ID)

  if (isLoading || !data) {
    return <Loading />
  }

  return (
    <div>
      <span className="font-semibold text-[#656565] text-sm">Histórico de pedidos</span>
      <div className="w-full flex flex-col gap-2">
        {data.orders.map((order) => (
          <>
            {order.items.map((item) => (
              <OrderItem item={item} key={item.productId} date={order.date} total={order.total} />
            ))}
          </>
        ))}
      </div>
    </div>
  )
}
