import { UUID } from "../value-object/UUID";
import type { Product } from "./Product";

export class Event {
	private readonly id: UUID;
	private readonly name: string;
	private readonly startDate: Date;
	private readonly endDate: Date;
	private readonly location: string;
	private readonly imageUrl: string | null;
	private readonly products: Product[];

	constructor(
		id: string,
		name: string,
		startDate: Date,
		endDate: Date,
		location: string,
		imageUrl: string | null,
		products: Product[],
	) {
		this.id = new UUID(id);
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
		this.imageUrl = imageUrl;
		this.products = products;
	}

	static create(
		name: string,
		startDate: Date,
		endDate: Date,
		location: string,
		imageUrl: string | null,
	) {
		const uuid = UUID.create();

		return new Event(
			uuid.getValue(),
			name,
			startDate,
			endDate,
			location,
			imageUrl,
			[],
		);
	}

	getId() {
		return this.id.getValue();
	}

	getName() {
		return this.name;
	}

	getStartDate() {
		return this.startDate;
	}

	getEndDate() {
		return this.endDate;
	}

	getLocation() {
		return this.location;
	}

	getImageUrl() {
		return this.imageUrl;
	}

	getProducts() {
		return this.products;
	}

	addProduct(product: Product) {
		this.products.push(product);
	}
}
