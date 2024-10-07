export interface IOrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface IOrder {
  orderId: string
  total: number
  date: string
  items: IOrderItem[]
}