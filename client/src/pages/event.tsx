import { redirect, useParams } from "react-router-dom"
import { Header } from "../components/header"
import { PageWrapper } from "../layout/page-wrapper"
import { useGetProducts } from "../hooks/queries/useGetProducts"
import { ProductGrid } from "../components/product-grid"
import { Footer } from "../components/footer"
import { Loading } from "../components/loading"
import { useEventStore } from "../stores/event-store"

export const Event = () => {
  const setCurrentEvent = useEventStore((state) => state.setCurrentEvent)
  const { eventId } = useParams()
  const { data, isLoading } =  useGetProducts(eventId!)

  if (!eventId) {
    redirect("/")

    return null
  }

  setCurrentEvent(eventId)

  return (
    <>
      <Header title="Cardápio" />
      <PageWrapper>
        {isLoading || !data ? (<Loading />) : <ProductGrid products={data.products} />}
      </PageWrapper>
      <Footer />
    </>
  )
}
