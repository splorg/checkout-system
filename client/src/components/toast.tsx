import { FC, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IToast, useToastStore } from '../stores/toast-store'
import { cn } from '../utils'

export const Toast: FC<{toast: IToast}>  = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast)

  useEffect(() => {
    const timeout = setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)

    return () => clearTimeout(timeout)
  }, [toast.id, removeToast, toast.duration])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn("p-4 rounded-lg shadow-lg mb-4", {
        'bg-primary-green text-black': toast.type === 'success',
        'bg-red-500 text-white': toast.type === 'error',
      })}
    >
      {toast.message}
    </motion.div>
  )
}
