import { FC, InputHTMLAttributes, useEffect, useState } from "react"
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "../hooks/useDebounce"
import { cn } from "../utils"

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> {
  onSearch: (value: string) => void
}

export const Searchbar: FC<Props> = ({ onSearch, className, ...props }) => {
  const [inputValue, setInputValue] = useState('')
  const debouncedInputValue = useDebounce(inputValue, 300)

  useEffect(() => {
    onSearch(debouncedInputValue)
  }, [debouncedInputValue, onSearch])

  return (
    <div className="relative w-full">
      <input
        {...props}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn("flex items-center py-2 px-4 rounded-lg border border-primary-green bg-[#181818] text-white text-sm focus:outline-none", className)}
      />
      <IoSearch color="#FFFFFF" className="absolute right-4 top-1/2 transform -translate-y-1/2" />
    </div>
  )
}
