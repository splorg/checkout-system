import { FC, HTMLAttributes, useState } from "react"
import { IoIosTrash } from "react-icons/io";
import { useCartStore } from "../stores/cart-store"
import { cn } from "../utils"
import { useAddToCart } from "../hooks/mutations/useAddToCart";
import { useToastStore } from "../stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CURRENT_CART_QUERY_KEY } from "../hooks/queries/useGetCurrentCart";
import { TEST_USER_ID } from "../constants";
import { useEventStore } from "../stores/event-store";
import { useRemoveFromCart } from "../hooks/mutations/useRemoveFromCart";
import { ConfirmationModal } from "./confirm-remove-modal";
import { useModalStore } from "../stores/modal-store";

interface Props extends HTMLAttributes<HTMLDivElement> {
  productId: string
}

export const QuantityButton: FC<Props> = ({ productId, className }) => {
  const { cartId, cartItems } = useCartStore()
  const currentEvent = useEventStore((state) => state.currentEvent)
  const { openModal, closeModal } = useModalStore()
  const currentQuantity = cartItems.find((item) => item.productId === productId)?.quantity ?? 0
  const addToast = useToastStore((state) => state.addToast)
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient()

  const addItemMutation = useAddToCart({
    onSuccess: () => {
      addToast("Produto adicionado ao carrinho!", "success")
      queryClient.invalidateQueries({ queryKey: [TEST_USER_ID, currentEvent, GET_CURRENT_CART_QUERY_KEY] })
    },
    onError: () => {
      addToast("Erro ao adicionar produto ao carrinho!", "error")
    }
  })

  const removeItemMutation = useRemoveFromCart({
    onSuccess: () => {
      addToast("Produto removido.", "success")
      queryClient.invalidateQueries({ queryKey: [TEST_USER_ID, currentEvent, GET_CURRENT_CART_QUERY_KEY] })
    },
    onError: () => {
      addToast("Algo deu errado ao remover o produto.", "error")
    }
  })

  const increment = () => {
    if (!isLoading) {
      addItemMutation.mutate({ cartId, productId, quantity: 1 })
    }
  };

  const confirmRemove = () => {
    removeItemMutation.mutate({ cartId, productId })
    closeModal()
  }

  const decrement = () => {
    if (!isLoading) {
      if (currentQuantity === 1) {
        openModal(
          <ConfirmationModal
            isLoading={isLoading}
            onClose={closeModal}
            onConfirm={confirmRemove}
          />
        )
      } else {
        removeItemMutation.mutate({ cartId, productId })
      }
    }
  };

  const isLoading = addItemMutation.isPending || removeItemMutation.isPending

  return (
    <div
      className={cn("rounded-full font-bold text-[10px] flex items-center text-black justify-center transition-all duration-300 ease-in-out overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={decrement}
        disabled={isLoading}
        className={cn("h-full flex items-center justify-center transition-all duration-300 -mr-[2px]", {
          "w-1/3 bg-white": isHovered,
          "w-1/2 bg-primary-green": !isHovered,
          "opacity-50 cursor-not-allowed": isLoading,
        })}
      >
        <span className="h-full flex items-center justify-center">
          {currentQuantity === 1 && isHovered ? <IoIosTrash size={16} /> : "–"}
        </span>
      </button>
      <div
        className={cn("h-full flex items-center justify-center transition-all duration-300", {
          "w-1/3 bg-white": isHovered,
          "w-0 opacity-0": !isHovered
        })}
      >
        <span className="font-bold">{isLoading ? "..." : currentQuantity}</span>
      </div>
      <button
        onClick={increment}
        disabled={isLoading}
        className={cn("h-full flex items-center justify-center transition-all duration-300 -ml-[2px]", {
          "w-1/3 bg-white": isHovered,
          "w-1/2 bg-white flex items-center justify-center": !isHovered,
          "opacity-50 cursor-not-allowed": isLoading,
        })}
      >
        <span className={cn("font-bold", {
          "mr-2": !isHovered,
        })}>
            {isHovered ? '+' : (isLoading ? '...' : currentQuantity)}
        </span>
      </button>
    </div>
  );
}
