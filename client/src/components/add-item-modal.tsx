import { FC } from "react"
import { PrimaryButton } from "./primary-button"
import { CgSpinnerAlt } from "react-icons/cg"

interface Props {
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
}

export const AddItemModal: FC<Props> = ({ isLoading, onClose, onConfirm, productName }) => {
  return (
    <div
      className="text-center text-black rounded-lg max-w-[390px] mx-auto"
    >
      <h2 
        className="text-2xl font-bold mb-4"
      >
        Adicionar produto
      </h2>
      <p
        className="font-semibold mb-8"
      >
        Deseja adicionar {productName} ao carrinho?
      </p>

      <div 
        className="flex justify-between items-center space-x-4"
      >
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <PrimaryButton 
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? <CgSpinnerAlt className="animate-spin" /> : "Confirmar"}
        </PrimaryButton>
      </div>
    </div>
  )
}
