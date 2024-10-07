import { FC } from 'react'
import { IEvent } from '../services/event/types'
import { LinkArrow } from './link-arrow'
import { formatCustomDate } from '../utils'

interface Props {
  events: IEvent[]
}

export const EventList: FC<Props> = ({ events }) => {
  return (
    <div className="flex flex-col gap-2">
      {events.map((event) => (
        <LinkArrow to={`/events/${event.id}`} key={event.id}>
          <div className='flex gap-4 items-center'>
            <img
              src={event.imageUrl}
              alt={event.name}
              className='size-20 rounded object-cover'
            />

            <div className='flex flex-col'>
              <span className='font-bold leading-5'>{event.name}</span>
              <span className='text-sm font-medium text-[#D5FF5C] leading-4'>{formatCustomDate(event.startDate)}</span>
              <span className='text-sm text-[#E3E3E3] leading-4'>{event.location}</span>
            </div>
          </div>
        </LinkArrow>
      ))}
    </div>
  )
}

export const EventListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <LinkArrow to={"#"} className="pointer-events-none">
        <div className="flex gap-4 items-center">
          <div
            className="animate-pulse bg-slate-400 size-20 rounded"
          />

          <div className="flex flex-col">
            <div className='w-[18ch] my-2 h-4 animate-pulse bg-slate-400 rounded-sm' />
            <div className='w-[8ch] h-[14px] my-2 animate-pulse bg-slate-400 rounded-sm' />
            <div className='w-[12ch] h-3 my-2 animate-pulse bg-slate-400 rounded-sm' />
          </div>
        </div>
      </LinkArrow>
    </div>
  )
}
