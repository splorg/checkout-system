import { FC, ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils'
import { IoIosArrowForward } from 'react-icons/io'

export const LinkArrow: FC<ComponentProps<typeof Link>> = ({ children, className, ...props }) => {
  return (
    <Link className={cn('border border-[#3C3C3C] flex rounded-md justify-between items-center p-2 hover:bg-[#3C3C3C] transition-colors duration-300', className)} {...props}>
      <div>
        {children}
      </div>

      <IoIosArrowForward color='#a3a3a3' size={24} />
    </Link>
  )
}
