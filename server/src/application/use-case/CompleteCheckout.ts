import type { CartService } from "@/application/service/CartService";
import { Order } from "@/domain/entity/Order";
import {
	CartEmptyError,
	CartNotFoundError,
	InsufficientFundsError,
	WalletNotFoundError,
} from "@/domain/errors";
import type { OrderRepository } from "@/domain/repository/OrderRepository";
import type { CheckoutResultDTO } from "../dto/CheckoutResult";
import type { WalletService } from "../service/WalletService";

export class CompleteCheckout {
	constructor(
		private readonly cartService: CartService,
		private readonly walletService: WalletService,
		private readonly orderRepository: OrderRepository,
	) {}

	async execute(cartId: string): Promise<CheckoutResultDTO> {
		const cart = await this.cartService.findActiveCart(cartId);

		if (!cart) {
			throw new CartNotFoundError(cartId);
		}

		if (cart.isEmpty()) {
			throw new CartEmptyError();
		}

		const userId = cart.getUserId();
		const eventId = cart.getEventId();

		const wallet = await this.walletService.getWallet(userId);

		if (!wallet) {
			throw new WalletNotFoundError(userId);
		}

		const totalAmount = cart.getTotal();

		if (wallet.getBalance().getValue() < totalAmount.getValue()) {
			throw new InsufficientFundsError(
				wallet.getBalance().getValue(),
				totalAmount.getValue(),
			);
		}

		const cartItems = cart.getItems().map((item) => ({
			productId: item.getProductId(),
			productName: item.getProductName(),
			quantity: item.getQuantity(),
			price: item.getPrice(),
		}));

		const checkoutResult = await this.orderRepository.performCheckout(
			cart,
			wallet,
			Order.create(userId, eventId, new Date(), cartItems),
		);

		return checkoutResult;
	}
}
