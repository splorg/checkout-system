import type { ProductListDTO } from "@/application/dto/ProductList";
import type { Product } from "@/domain/entity/Product";
import { EventNotFoundError } from "@/domain/errors";
import type { EventRepository } from "@/domain/repository/EventRepository";
import type { ProductRepository } from "@/domain/repository/ProductRepository";

export class GetEventProductList {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly eventRepository: EventRepository,
	) {}

	async execute(eventId: string): Promise<ProductListDTO> {
		const event = await this.eventRepository.findById(eventId);

		if (!event) {
			throw new EventNotFoundError(eventId);
		}

		const products = await this.productRepository.findByEventId(event.getId());

		return this.toDTO(products);
	}

	private toDTO(products: Product[]): ProductListDTO {
		return {
			products: products.map((product) => ({
				id: product.getId(),
				eventId: product.getEventId(),
				name: product.getName(),
				price: product.getPrice(),
				imageUrl: product.getImageUrl(),
			})),
		};
	}
}
