export interface ICartItem {
  productId: string
  productName: string
  imageUrl: string | null
  quantity: number
  price: number
}

export interface ICart {
  id: string
  status: string
  total: number
  items: ICartItem[]
}

export interface ICheckoutResult {
  success: boolean
  message: string
  orderId?: string
  remainingBalance?: number
}