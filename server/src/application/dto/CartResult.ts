import type { Cart, CartStatus } from "@/domain/aggregate/Cart";
import type { Product } from "@/domain/entity/Product";

export interface CartResultDTO {
	cart: {
		id: string;
		status: CartStatus;
		total: number;
		items: {
			productId: string;
			productName: string;
			imageUrl: string | null;
			quantity: number;
			price: number;
		}[];
	};
}

export class CartResultMapper {
	static toDTO(cart: Cart, products: Product[]): CartResultDTO {
		return {
			cart: {
				id: cart.getId(),
				status: cart.getStatus(),
				total: cart.getTotal().getValue(),
				items: products.map((product) => ({
					productId: product.getId(),
					productName: product.getName(),
					imageUrl: product.getImageUrl(),
					quantity: cart.getItem(product.getId())?.getQuantity() || 0,
					price: product.getPrice(),
				})),
			},
		};
	}
}
