import { FC, ComponentProps } from "react"
import { motion } from "framer-motion"
import { cn } from "../utils"

export const PrimaryButton: FC<ComponentProps<typeof motion.button>> = ({ children, className, disabled, ...props }) => {
  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.1 }} 
      whileTap={{ scale: disabled ? 1 : 1.1 }} 
      transition={{ type: "spring", stiffness: 150, damping: 10 }}
      className={cn(
        "bg-primary-green py-[14px] px-8 rounded-full text-black font-bold hover:brightness-90 transition-colors duration-300",
        className,
        {
          "pointer-events-none cursor-not-allowed bg-neutral-400 hover:bg-neutral-400": disabled,
        }
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
