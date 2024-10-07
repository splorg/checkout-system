import { useModalStore } from "../stores/modal-store";
import { BottomSheet } from "./bottom-sheet";

export const Modal = () => {
  const { isOpen, content, closeModal } = useModalStore();

  return (
    <BottomSheet isOpen={isOpen} onClose={closeModal}>
      {content}
    </BottomSheet>
  )
}
