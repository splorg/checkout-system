import { Product } from "@/domain/entity/Product";
import type { Product as PrismaProduct } from "@prisma/client";

export class ProductMapper {
	static toDomain(product: PrismaProduct): Product {
		return new Product(
			product.id,
			product.eventId,
			product.name,
			product.price,
			product.stock,
			product.imageUrl || null,
		);
	}
}
