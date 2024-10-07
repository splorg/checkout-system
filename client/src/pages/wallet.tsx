import { useNavigate } from "react-router-dom"
import { Header } from "../components/header"
import { OrderHistory } from "../components/order-history"
import { PrimaryButton } from "../components/primary-button"
import { WalletAmount } from "../components/wallet-amount"
import { PageWrapper } from "../layout/page-wrapper"

export const Wallet = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header title="Carteira" showBackButton={false} />
      <PageWrapper>
        <div className="mt-4 flex flex-col gap-6">
          <WalletAmount />
          <OrderHistory />
        </div>
      </PageWrapper>
      <div className="flex items-center justify-center sticky top-[100vh] my-4 max-w-sm mx-auto">
        <PrimaryButton className="w-full" onClick={() => navigate("/")}>
          Comprar produtos
        </PrimaryButton>
      </div>
    </>
  )
}
