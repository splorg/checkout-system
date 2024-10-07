import type { Product } from "@/domain/entity/Product";
import type { ProductRepository } from "@/domain/repository/ProductRepository";
import type { PrismaClient } from "@prisma/client";
import { ProductMapper } from "../mappers/ProductMapper";

export class PrismaProductRepository implements ProductRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findById(id: string): Promise<Product | null> {
		const productData = await this.prisma.product.findUnique({ where: { id } });

		if (!productData) {
			return null;
		}

		return ProductMapper.toDomain(productData);
	}

	async findByEventId(eventId: string): Promise<Product[]> {
		const productsData = await this.prisma.product.findMany({
			where: {
				eventId,
				stock: { gt: 0 },
			},
		});

		return productsData.map(ProductMapper.toDomain);
	}

	async getCartItems(productIds: string[]): Promise<Product[]> {
		const productsData = await this.prisma.product.findMany({
			where: { id: { in: productIds } },
		});

		return productsData.map(ProductMapper.toDomain);
	}
}
