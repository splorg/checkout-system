import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const BottomSheet: FC<Props> = ({
  children,
  isOpen,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsClosing(true);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleAnimationComplete = () => {
    if (isClosing) {
      onClose();
      setIsClosing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsClosing(true)}
          />
          <motion.div
            className={"fixed bottom-0 left-0 right-0 max-h-1/2 bg-white rounded-t-2xl shadow-xl z-[99999] overflow-hidden"}
            initial={{ y: '100%' }}
            animate={{ y: isClosing ? '100%' : 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="p-4 h-full overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
