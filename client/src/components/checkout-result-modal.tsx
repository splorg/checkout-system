import { FC } from "react"
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { cn, formatCurrency } from "../utils";
import { PrimaryButton } from "./primary-button";

interface BaseProps {
  onClose: () => void
}

interface SuccessProps extends BaseProps {
  type: "success"
  remainingBalance: number
}

interface ErrorProps extends BaseProps {
  type: "error"
}

type Props = SuccessProps | ErrorProps

export const CheckoutResultModal: FC<Props> = (props) => {
  const { type, onClose } = props;
  const remainingBalance = props.type === 'success' ? props.remainingBalance : 0;

  return (
    <div className="text-[#181818] max-w-[390px] mx-auto flex flex-col items-center justify-center">
      <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-2", {
        "bg-primary-green": type === "success",
        "bg-[#FF5C5C]": type === "error",
      })}>
        {type === "success" ? (
          <IoMdCheckmark size={32} color="#181818" />
        ) : (
          <IoMdClose size={32} color="#FFF" />
        )}
      </div>

      <p className="font-bold text-3xl mb-8">
        {type === "success" ? "Compra realizada" : "Saldo insuficiente"}
      </p>

      {type === "success" && (
        <p className="text-sm text-[#181818] mb-8">
          O seu saldo é de {formatCurrency(remainingBalance)}.
        </p>
      )}

      <PrimaryButton onClick={onClose} className="w-full">
        Continuar
      </PrimaryButton>
    </div>
  )
}
