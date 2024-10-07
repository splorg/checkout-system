import { CgSpinnerAlt } from "react-icons/cg";

export const Loading = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <CgSpinnerAlt className="animate-spin h-10 w-10 text-primary-green" />
    </div>
  )
}