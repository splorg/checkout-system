import type { CartService } from "@/application/service/CartService";
import { CartNotFoundError, ProductNotFoundError } from "@/domain/errors";
import type { ProductRepository } from "@/domain/repository/ProductRepository";
import { type CartResultDTO, CartResultMapper } from "../dto/CartResult";

export class RemoveProductFromCart {
	constructor(
		private readonly cartService: CartService,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(cartId: string, productId: string): Promise<CartResultDTO> {
		const cart = await this.cartService.findActiveCart(cartId);
		if (!cart) {
			throw new CartNotFoundError(cartId);
		}

		const product = await this.productRepository.findById(productId);
		if (!product) {
			throw new ProductNotFoundError(productId);
		}

		const resultingCart = await this.cartService.removeItemFromCart(
			cart,
			product.getId(),
		);

		const allProductsInCart = await this.productRepository.getCartItems(
			resultingCart.getItems().map((item) => item.getProductId()),
		);

		return CartResultMapper.toDTO(resultingCart, allProductsInCart);
	}
}
