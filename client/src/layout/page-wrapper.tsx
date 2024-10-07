import { ComponentProps, FC, ReactNode,  } from "react"
import { cn } from "../utils"

interface Props extends ComponentProps<"main"> {
  children: ReactNode
}

export const PageWrapper: FC<Props> = ({ children, className, ...props }) => {
  return (
    <main className={cn("max-w-[390px] mx-auto gap-8 px-4 pb-10", className)} {...props}>
      {children}
    </main>
  )
}
