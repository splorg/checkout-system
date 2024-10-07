import type { Product } from "@/domain/entity/Product";

export interface ProductRepository {
	findById(id: string): Promise<Product | null>;
	findByEventId(eventId: string): Promise<Product[]>;
	getCartItems(productIds: string[]): Promise<Product[]>;
}
