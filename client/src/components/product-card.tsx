import { FC, useCallback, useMemo } from "react"
import { cn, formatCurrency } from "../utils"
import { useCartStore } from "../stores/cart-store"
import { AddItemModal } from "./add-item-modal"
import { useCreateCart } from "../hooks/mutations/useCreateCart"
import { TEST_USER_ID } from "../constants"
import { useToastStore } from "../stores/toast-store"
import { useAddToCart } from "../hooks/mutations/useAddToCart"
import { ProductImage } from "./product-image"
import { IProduct } from "../services/event/types"
import { useQueryClient } from "@tanstack/react-query"
import { GET_CURRENT_CART_QUERY_KEY } from "../hooks/queries/useGetCurrentCart"
import { useEventStore } from "../stores/event-store"
import { useModalStore } from "../stores/modal-store"

interface Props {
  product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  const { openModal, closeModal } = useModalStore()
  const { id, name, price, imageUrl } = product
  const eventId = useEventStore((state) => state.currentEvent)
  const queryClient = useQueryClient()
  const { cartItems, cartId } = useCartStore()
  const { addToast } = useToastStore()

  const isInCart = useMemo(() => cartItems.some((item) => item.productId === id), [cartItems, id])

  const invalidateCartQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [TEST_USER_ID, eventId, GET_CURRENT_CART_QUERY_KEY] })
  }, [queryClient, eventId])

  const handleSuccess = useCallback(() => {
    invalidateCartQuery()
    addToast("Produto adicionado ao carrinho!", "success")
  }, [invalidateCartQuery, addToast])

  const handleError = useCallback(() => {
    addToast("Erro ao adicionar produto ao carrinho!", "error")
  }, [addToast])

  const { mutate: createCart, isPending: isCreatingCart } = useCreateCart({
    userId: TEST_USER_ID,
    eventId: eventId!,
    productId: id,
    quantity: 1,
    onSuccess: handleSuccess,
    onError: handleError,
  })

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart({
    onSuccess: handleSuccess,
    onError: handleError,
  })

  const handleConfirmModal = useCallback(() => {
    if (cartId) {
      addToCart({
        cartId: cartId,
        productId: id,
        quantity: 1,
      })
    } else {
      createCart()
      closeModal()
    }
  }, [cartId, addToCart, id, createCart, closeModal])

  const isLoading = isCreatingCart || isAddingToCart

  const handleCardClick = useCallback(() => {
    if (!isInCart) {
      openModal(
        <AddItemModal
          onClose={closeModal}
          onConfirm={handleConfirmModal}
          productName={name}
          isLoading={isLoading}
        />
      )
    }
  }, [closeModal, handleConfirmModal, isInCart, isLoading, name, openModal])

  return (
    <div onClick={handleCardClick} className={cn({
      "cursor-pointer hover:brightness-110 transition-all duration-300": !isInCart,
      })}>
      <ProductImage productId={id} productName={name} imageUrl={imageUrl} isOutlined={isInCart} showQuantityButton={isInCart} />

      <div className={cn("mt-4 text-left w-full flex flex-col", {
        "pt-2": isInCart,
      })}>
        <span className="text-xs font-bold">{name}</span>
        <span className="text-xs text-primary-green">{formatCurrency(price)}</span>
      </div>
    </div>
  )
}

