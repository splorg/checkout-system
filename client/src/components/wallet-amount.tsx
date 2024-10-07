import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline  } from "react-icons/io5";
import { useGetWallet } from "../hooks/queries/useGetWallet";
import { TEST_USER_ID } from "../constants";
import { Loading } from "./loading";
export const WalletAmount = () => {
  const [showContent, setShowContent] = useState(false)
  const { data, isLoading } = useGetWallet(TEST_USER_ID)

  if (isLoading || !data) {
    return <Loading />
  }

  const formattedAmount = (data.wallet.balance / 100).toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const toggleShowContent = () => {
    setShowContent(!showContent)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-[#656565] font-semibold text-sm">Saldo disponível</span>
        <span className="font-bold text-[32px]">R$ {showContent ? formattedAmount : "••••"}</span>
      </div>

      <div>
        <button onClick={toggleShowContent}>
          {showContent ? <IoEyeOffOutline size={24} /> : <IoEyeOutline size={24} />}
        </button>
      </div>
    </div>
  )
}
