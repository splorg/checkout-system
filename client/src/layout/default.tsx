import { useIsPresent, motion, AnimatePresence } from 'framer-motion'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { useToastStore } from '../stores/toast-store'
import { Toast } from '../components/toast'

export const DefaultLayout: FC = () => {
  const isPresent = useIsPresent()
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className='w-full min-h-screen overflow-y-scroll'>
      <Outlet />
      <div className='fixed bottom-8 right-8 z-50'>
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast toast={toast} key={toast.id} />
          ))}
        </AnimatePresence>
      </div>
      <motion.div 
        initial={{ scaleX: 1}}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut"} }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="fixed top-0 left-0 right-0 bottom-0 bg-primary-green z-[999]"
      />
    </div>
  )
}

