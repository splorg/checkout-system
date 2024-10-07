import { FC, useMemo, useState } from "react"
import { IProduct } from "../services/event/types"
import { ProductCard } from "./product-card"
import { Searchbar } from "./searchbar"

interface Props {
  products: IProduct[]
}

export const ProductGrid: FC<Props> = ({ products }) => {
  const [searchValue, setSearchValue] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [products, searchValue])

  return (
    <div className="w-full flex flex-col items-center gap-7">
      <Searchbar onSearch={setSearchValue} placeholder="Buscar produto" className="w-full" />

      <div className="w-full grid gap-x-4 gap-y-6 grid-cols-auto-fit-100 justify-items-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
