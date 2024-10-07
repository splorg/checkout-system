import { LinkArrow } from "../components/link-arrow"
import { useGetEvents } from "../hooks/queries/useGetEvents"
import { EventList } from "../components/event-list"
import { PageWrapper } from "../layout/page-wrapper"
import { Loading } from "../components/loading"

export const Home = () => {
  const { data, isLoading } = useGetEvents()

  return (
    <PageWrapper>
      <div className="flex flex-col w-full gap-8 py-8">
        <h1 className="text-2xl font-black">Eventos</h1>

        {isLoading || !data ? (<Loading />) : <EventList events={data.events} />}

        <LinkArrow to={"/wallet"}>
          <span>Carteira</span>
        </LinkArrow>
      </div>
    </PageWrapper>
  )
}
