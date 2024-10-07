import type { CartService } from "@/application/service/CartService";
import {
	CartNotFoundError,
	InsufficientStockError,
	ProductNotAvailableError,
	ProductNotFoundError,
} from "@/domain/errors";
import type { ProductRepository } from "@/domain/repository/ProductRepository";
import { type CartResultDTO, CartResultMapper } from "../dto/CartResult";

export class AddProductToCart {
	constructor(
		private readonly cartService: CartService,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(
		cartId: string,
		productId: string,
		quantity: number,
	): Promise<CartResultDTO> {
		const product = await this.productRepository.findById(productId);
		if (!product) {
			throw new ProductNotFoundError(productId);
		}

		if (!product.isAvailable()) {
			throw new ProductNotAvailableError(product.getId());
		}

		if (quantity > product.getStock()) {
			throw new InsufficientStockError(product.getStock(), quantity);
		}

		const cart = await this.cartService.findActiveCart(cartId);

		if (!cart) {
			throw new CartNotFoundError(cartId);
		}

		const resultingCart = await this.cartService.addItemToCart(
			cart,
			product,
			quantity,
		);

		const allProductsInCart = await this.productRepository.getCartItems(
			resultingCart.getItems().map((item) => item.getProductId()),
		);

		return CartResultMapper.toDTO(resultingCart, allProductsInCart);
	}
}
