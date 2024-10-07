import { FC } from 'react'
import { QuantityButton } from './quantity-button'
import { cn } from '../utils'

interface Props {
  productId: string
  productName: string
  imageUrl: string | null
  isOutlined?: boolean
  showQuantityButton?: boolean
}

export const ProductImage: FC<Props> = ({ productId, productName, imageUrl, isOutlined, showQuantityButton }) => {
  return (
    <>
      {imageUrl ? (
          <div
            className="relative"
          >
            <img
              src={imageUrl}
              alt={productName}
              className={cn("rounded-lg w-[100px] h-[100px] object-cover", {
                "border-2 border-primary-green": isOutlined,
              })}
            />
            {showQuantityButton && <QuantityButton productId={productId} className="w-16 h-5 absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10" />}
          </div>
        ) : (
          <div 
            className="relative"
          >
            <div className={cn("w-[100px] h-[100px] rounded-lg bg-[#D9D9D9] flex items-center justify-center", {
              "border-2 border-primary-green": isOutlined,
            })}>
              <span className="text-xs text-center font-bold text-[#181818]">{productName}</span>
            </div>
            {showQuantityButton && <QuantityButton productId={productId} className="w-16 h-5 absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10" />}
          </div>
        )}
    </>
  )
}
