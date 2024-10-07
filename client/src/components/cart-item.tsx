import { FC } from "react"
import { ICartItem } from "../services/cart/types"
import { formatCurrency } from "../utils"
import { ProductImage } from "./product-image"
import { QuantityButton } from "./quantity-button"

interface Props {
  item: ICartItem
}

export const CartItem: FC<Props> = ({ item }) => {
  return (
    <div className="bg-black rounded-xl px-3 py-4 flex items-center justify-between gap-4">
      <ProductImage productId={item.productId} productName={item.productName} imageUrl={item.imageUrl} isOutlined />

      <div className="flex flex-col text-xs font-bold basis-1/3">
        <span>{item.productName}</span>
        <span className="text-primary-green">{formatCurrency(item.price)}</span>
      </div>

      <QuantityButton productId={item.productId} className="w-20 h-8 rounded-xl" />
    </div>
  )
}
