import { ProductNotFoundError } from "@/domain/errors";
import type { ProductRepository } from "@/domain/repository/ProductRepository";
import { type CartResultDTO, CartResultMapper } from "../dto/CartResult";
import type { CartService } from "../service/CartService";

export class CreateCart {
	constructor(
		private readonly cartService: CartService,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(
		userId: string,
		eventId: string,
		productId: string,
		quantity: number,
	): Promise<CartResultDTO> {
		const product = await this.productRepository.findById(productId);

		if (!product) {
			throw new ProductNotFoundError(productId);
		}

		const resultingCart = await this.cartService.createNewCart(
			userId,
			eventId,
			product,
			quantity,
		);

		const allProductsInCart = await this.productRepository.getCartItems(
			resultingCart.getItems().map((item) => item.getProductId()),
		);

		return CartResultMapper.toDTO(resultingCart, allProductsInCart);
	}
}
