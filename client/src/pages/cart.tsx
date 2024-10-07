import { CurrentCart } from "../components/current-cart"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { PageWrapper } from "../layout/page-wrapper"

export const Cart = () => {
  return (
    <>
      <Header title="Checkout" />
      <PageWrapper>
        <CurrentCart />
      </PageWrapper>
      <Footer />
    </>
  )
}
