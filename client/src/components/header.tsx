import { FC } from "react"
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils";

interface Props {
  title: string
  showBackButton?: boolean
}

export const Header: FC<Props> = ({ title, showBackButton = true }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (showBackButton) {
      navigate("/")
    }
  }

  return (
    <header className="px-6 py-8">
      <div className="px-4 flex w-full items-center justify-between sm:max-w-[390px] mx-auto">
        <div
          className={cn(
            "h-8 w-8  flex items-center justify-center rounded-full",
            {
              "cursor-pointer bg-white hover:bg-gray-100 transition-colors duration-300": showBackButton
            }
          )} 
          onClick={handleBack}
        >
          {showBackButton && <IoMdArrowBack size={20} color="#181818" onClick={handleBack} />}
        </div>
        <h1 className="text-white text-2xl font-bold">{title}</h1>
      </div>
    </header>
  )
}
