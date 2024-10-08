import { useLocation, useNavigate } from "react-router-dom"
import { useCartStore } from "../stores/cart-store"
import { formatCurrency } from "../utils"
import { PrimaryButton } from "./primary-button"
import { useEventStore } from "../stores/event-store"
import { TEST_USER_ID } from "../constants"
import { useGetCurrentCart } from "../hooks/queries/useGetCurrentCart"
import { useEffect } from "react"
import { useCheckout } from "../hooks/mutations/useCheckout"
import { useModalStore } from "../stores/modal-store"
import { ICheckoutResult } from "../services/cart/types"
import { CheckoutResultModal } from "./checkout-result-modal"
import { useQueryClient } from "@tanstack/react-query"
import { GET_PRODUCT_QUERY_KEY } from "../hooks/queries/useGetProducts"

export const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const currentEvent = useEventStore((state) => state.currentEvent)
  const { setCartId, setCartItems, clearCart } = useCartStore()
  const { openModal, closeModal } = useModalStore()
  const { data, isLoading, refetch } = useGetCurrentCart(TEST_USER_ID, currentEvent)

  const handleCloseOnSuccess = () => {
    closeModal()
    navigate(`/events/${currentEvent}`)
  }

  const handleSuccessModal = (data: ICheckoutResult) => {
    openModal(
      <CheckoutResultModal 
        type="success" 
        onClose={handleCloseOnSuccess} 
        remainingBalance={data.remainingBalance!} 
      />
    )
  }

  const handleFailureModal = () => {
    openModal(
      <CheckoutResultModal 
        type="error"
        onClose={closeModal}
      />
    )
  }

  const checkoutMutation = useCheckout({
    onError: () => {
      handleFailureModal()
    },
    onSuccess: (data) => {
      handleSuccessModal(data)
      clearCart()
      refetch()
      queryClient.invalidateQueries({ queryKey: [currentEvent, GET_PRODUCT_QUERY_KEY] })
    }
  })

  useEffect(() => {
    if (data?.cart) {
      const { id, items } = data.cart
      setCartId(id)
      setCartItems(items)
    }
  }, [data, setCartId, setCartItems])

  const handleConfirm = () => {
    if (location.pathname !== "/cart") {
      navigate("/cart")
      return
    }

    if (data?.cart.id) {
      checkoutMutation.mutate({ cartId: data.cart.id })
    }
  }

  const total = data?.cart?.total ?? 0
  const items = data?.cart?.items ?? []
  const isDisabled = checkoutMutation.isPending || isLoading

  return (
    <footer className="bg-[#181818] px-6 py-4 sticky top-[100vh] w-full">
      <div className="px-4 flex w-full items-center justify-between sm:max-w-[390px] mx-auto">
        <div className="flex flex-col justify-center">
          <span className="text-[#A2A2A2] text-xs">Valor total</span>
          <p className="font-bold text-2xl">{formatCurrency(total)}</p>
        </div>

        <PrimaryButton disabled={isDisabled || !items.length} onClick={handleConfirm}>Confirmar</PrimaryButton>
      </div>
    </footer>
  )
}
